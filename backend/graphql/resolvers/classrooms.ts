import {
  MutationCreateClassroomArgs,
  MutationDeleteClassroomArgs,
  MutationJoinClassroomArgs,
  MutationRemoveStudentArgs,
  QueryGetClassroomArgs,
} from "./../../gql-types.d";
import { ApolloError } from "apollo-server";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";
import * as argon2 from "argon2";

module.exports = {
  Query: {
    getTeacherClassrooms: async (_: any, __: any, context: any) => {
      logger.info("GraphQL classrooms/getTeacherClassrooms");

      // Get all the classrooms for a teacher.

      const user = isAuth(context);

      const classrooms = await prisma.classroom.findMany({
        where: {
          userId: user.id,
        },
        include: {
          creator: true,
          users: { include: { user: true } },
        },
      });

      return classrooms.map((classroom) => ({
        ...classroom,
        users: classroom.users.map((e) => e.user),
      }));
    },
    getLearnerClassrooms: async (_: any, __: any, context: any) => {
      logger.info("GraphQL classrooms/getLearnerClassrooms");

      // Get all the classrooms for a student.

      const user = isAuth(context);

      const usersOnClassrooms = await prisma.usersOnClassrooms.findMany({
        where: {
          userId: user.id,
        },
        include: {
          classroom: true,
        },
      });

      return usersOnClassrooms.map((e) => e.classroom);
    },
    getClassroom: async (
      _: any,
      { classroomId }: QueryGetClassroomArgs,
      context: any
    ) => {
      logger.info("GraphQL classrooms/getClassroom");

      // Get a classroom to view. Also used when joining a classroom to get basic information.

      const classroom = await prisma.classroom.findUnique({
        where: {
          id: parseInt(classroomId),
        },
        include: {
          assignments: {
            include: { problems: { include: { problem: true } } },
          },
          creator: true,
          users: { include: { user: true } },
        },
      });

      if (classroom) {
        return {
          ...classroom,
          users: classroom.users.map((e) => e.user),
        };
      }

      throw new ApolloError("This classroom does not exist.");
    },
  },
  Mutation: {
    createClassroom: async (
      _: any,
      { classroomName, password }: MutationCreateClassroomArgs,
      context: any
    ) => {
      logger.info("GraphQL classrooms/createClassroom");

      // Create classroom, used by teacher.

      const user = isAuth(context);

      if (classroomName === "") {
        throw new ApolloError("Classroom name cannot be empty.");
      }

      const existingClassroom = await prisma.classroom.findFirst({
        where: {
          name: classroomName,
          userId: user.id,
        },
      });

      if (existingClassroom) {
        throw new ApolloError(
          "Cannot create classroom as you already have a classroom with the same name."
        );
      }

      if (password) {
        password = await argon2.hash(password);
      }

      const classroom = await prisma.classroom.create({
        data: {
          userId: user.id,
          name: classroomName,
          password: password || "",
        },
      });

      return classroom;
    },
    joinClassroom: async (
      _: any,
      { classroomId, password }: MutationJoinClassroomArgs,
      context: any
    ) => {
      logger.info("GraphQL classrooms/joinClassroom");

      // Add user to a classroom, used when inviting users.

      const user = isAuth(context);

      const classroom = await prisma.classroom.findUnique({
        where: {
          id: parseInt(classroomId),
        },
      });

      if (!classroom) {
        throw new ApolloError(
          "Failed to find classroom you are attempting to join."
        );
      }

      if (classroom.password) {
        const isValidPasword = await argon2.verify(
          classroom.password,
          password || ""
        );

        if (!isValidPasword) {
          throw new ApolloError(
            "Cannot join classroom due to invalid password."
          );
        }
      }

      // Check if the person trying to join is the classroom owner
      if (classroom.userId === user.id) {
        throw new ApolloError(
          "You cannot join a classroom as you are its creator."
        );
      }

      // Check if the user is already a member of this classroom
      const userInClassroom = await prisma.usersOnClassrooms.findFirst({
        where: {
          userId: user.id,
          classroomId: classroom.id,
        },
      });

      if (userInClassroom) {
        throw new ApolloError("You are already a member of this classroom.");
      }

      await prisma.usersOnClassrooms.create({
        data: {
          userId: user.id,
          classroomId: classroom.id,
        },
      });

      return classroom;
    },
    deleteClassroom: async (
      _: any,
      { classroomId, classroomName, password }: MutationDeleteClassroomArgs,
      context: any
    ) => {
      logger.info("GraphQL classrooms/deleteClassroom");

      // Used by teacher to delete a classroom

      const user = isAuth(context);

      const classroom = await prisma.classroom.findFirst({
        where: {
          id: parseInt(classroomId),
          userId: user.id,
        },
      });

      if (!classroom) {
        throw new ApolloError(
          "Failed to find classroom you are attempting to delete."
        );
      }

      if (classroom.password) {
        const isValidPasword = await argon2.verify(
          classroom.password,
          password || ""
        );

        if (!isValidPasword) {
          throw new ApolloError(
            "Cannot delete classroom due to invalid password."
          );
        }
      }

      if (classroom.name !== classroomName) {
        throw new ApolloError(
          "Failed to delete classroom as the name you entered is not correct."
        );
      }

      await prisma.classroom.delete({
        where: {
          id: classroom.id,
        },
      });

      return true;
    },
    removeStudent: async (
      _: any,
      { studentId, classroomId }: MutationRemoveStudentArgs,
      context: any
    ) => {
      logger.info("GraphQL classrooms/removeStudent");

      // Used by students and teachers to remove a student from a classroom.
      // Teachers can remove any student.
      // Students can only remove themselves.

      const user = isAuth(context);

      const classroom = await prisma.classroom.findFirst({
        where: {
          id: parseInt(classroomId),
        },
        include: {
          creator: true,
        },
      });

      if (!classroom) {
        throw new ApolloError(
          "Failed to find classroom you are attempting to remove student from."
        );
      }

      const student = await prisma.usersOnClassrooms.findFirst({
        where: {
          classroomId: classroom.id,
          userId: parseInt(studentId),
        },
      });

      if (!student) {
        throw new ApolloError(
          "Failed to find student you are attempting to remove."
        );
      }

      // To remove a student, you must either be that same student or the creator of the classroom
      if (classroom.creator.id === user.id || student.userId === user.id) {
        await prisma.usersOnClassrooms.delete({
          where: {
            userId_classroomId: {
              userId: student?.userId,
              classroomId: classroom.id,
            },
          },
        });
        return true;
      }

      throw new ApolloError(
        "You do not have permission to remove this student from this classroom."
      );
    },
  },
};
