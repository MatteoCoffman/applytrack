import type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { getUserId, parseApplicationId } from "./auth.js";
import {
  createApplication,
  deleteApplication,
  listApplications,
  NotFoundError,
  updateApplication,
  ValidationError,
} from "./db.js";
import { errorResponse, jsonResponse } from "./response.js";
import type {
  CreateApplicationInput,
  UpdateApplicationInput,
} from "./types.js";

function parseBody<T>(event: APIGatewayProxyEventV2WithJWTAuthorizer): T {
  if (!event.body) {
    throw new ValidationError("Request body is required");
  }
  try {
    return JSON.parse(event.body) as T;
  } catch {
    throw new ValidationError("Invalid JSON body");
  }
}

export async function route(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
) {
  const method = event.requestContext.http.method;
  const path = event.rawPath;

  if (method === "OPTIONS") {
    return jsonResponse(200, { ok: true });
  }

  let userId: string;
  try {
    userId = getUserId(event);
  } catch {
    return errorResponse(401, "Unauthorized");
  }

  try {
    if (method === "GET" && path === "/applications") {
      const applications = await listApplications(userId);
      return jsonResponse(200, { applications });
    }

    if (method === "POST" && path === "/applications") {
      const body = parseBody<CreateApplicationInput>(event);
      const application = await createApplication(userId, body);
      return jsonResponse(201, { application });
    }

    const applicationId = parseApplicationId(path);
    if (applicationId) {
      if (method === "PUT") {
        const body = parseBody<UpdateApplicationInput>(event);
        const application = await updateApplication(
          userId,
          applicationId,
          body
        );
        return jsonResponse(200, { application });
      }

      if (method === "DELETE") {
        await deleteApplication(userId, applicationId);
        return jsonResponse(200, { ok: true });
      }
    }

    return errorResponse(404, "Not found");
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse(400, error.message);
    }
    if (
      error instanceof NotFoundError ||
      (error as { name?: string }).name === "ConditionalCheckFailedException"
    ) {
      return errorResponse(404, "Application not found");
    }

    console.error("Unhandled error", error);
    return errorResponse(500, "Internal server error");
  }
}
