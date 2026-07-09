import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SubmitAssignmentDto } from "./dto/submit-assignment.dto";

@Injectable()
export class AssignmentSubmissionsService {
  constructor(private prisma: PrismaService) {}

  async submit(userId: number, dto: SubmitAssignmentDto) {
    const studentProfile = await this.findStudentProfile(userId);

    const assignment = await this.prisma.assignment.findUnique({
      where: { id: dto.assignmentId },
      include: {
        courseAssignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException("Assignment not found");
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentProfileId_courseId: {
          studentProfileId: studentProfile.id,
          courseId: assignment.courseAssignment.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException(
        "You can only submit assignments for enrolled courses",
      );
    }

    return this.prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentProfileId: {
          assignmentId: dto.assignmentId,
          studentProfileId: studentProfile.id,
        },
      },
      create: {
        assignmentId: dto.assignmentId,
        studentProfileId: studentProfile.id,
        submissionUrl: dto.submissionUrl,
        comments: dto.comments,
      },
      update: {
        submissionUrl: dto.submissionUrl,
        comments: dto.comments,
        submittedAt: new Date(),
      },
      include: this.includeRelations(),
    });
  }

  async findMine(userId: number) {
    const studentProfile = await this.findStudentProfile(userId);

    return this.prisma.assignmentSubmission.findMany({
      where: {
        studentProfileId: studentProfile.id,
      },
      include: this.includeRelations(),
      orderBy: {
        submittedAt: "desc",
      },
    });
  }

  async findForFaculty(userId: number) {
    const facultyProfile = await this.findFacultyProfile(userId);

    return this.prisma.assignmentSubmission.findMany({
      where: {
        assignment: {
          courseAssignment: {
            facultyProfileId: facultyProfile.id,
          },
        },
      },
      include: this.includeRelations(),
      orderBy: {
        submittedAt: "desc",
      },
    });
  }

  async gradeSubmission(
    submissionId: number,
    facultyUserId: number,
    dto: { grade?: string; feedback?: string },
  ) {
    const submission = await this.prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            courseAssignment: {
              include: {
                facultyProfile: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException("Submission not found");
    }

    if (
      submission.assignment.courseAssignment.facultyProfile.userId !==
      facultyUserId
    ) {
      throw new ForbiddenException(
        "You can only grade your own course submissions",
      );
    }

    return this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        grade: dto.grade,
        feedback: dto.feedback,
      },
      include: this.includeRelations(),
    });
  }

  private async findStudentProfile(userId: number) {
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!studentProfile) {
      throw new NotFoundException("Student profile not found");
    }

    return studentProfile;
  }

  private async findFacultyProfile(userId: number) {
    const facultyProfile = await this.prisma.facultyProfile.findUnique({
      where: { userId },
    });

    if (!facultyProfile) {
      throw new NotFoundException("Faculty profile not found");
    }

    return facultyProfile;
  }

  private includeRelations() {
    return {
      assignment: {
        include: {
          courseAssignment: {
            include: {
              course: {
                include: {
                  department: true,
                },
              },
              facultyProfile: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      role: true,
                      status: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      studentProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      },
    };
  }
}