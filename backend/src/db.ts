import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { appSk, userPk } from "./auth.js";
import type {
  Application,
  CreateApplicationInput,
  DynamoApplicationItem,
  UpdateApplicationInput,
} from "./types.js";
import { APPLICATION_STATUSES } from "./types.js";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.TABLE_NAME!;

function toApplication(item: DynamoApplicationItem): Application {
  const { PK: _pk, SK: _sk, ...application } = item;
  return application;
}

function isValidStatus(status: string): status is Application["status"] {
  return APPLICATION_STATUSES.includes(status as Application["status"]);
}

export async function listApplications(userId: string): Promise<Application[]> {
  const result = await client.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": userPk(userId),
        ":skPrefix": "APP#",
      },
    })
  );

  const items = (result.Items ?? []) as DynamoApplicationItem[];
  return items
    .map(toApplication)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export async function createApplication(
  userId: string,
  input: CreateApplicationInput
): Promise<Application> {
  if (!input.company?.trim() || !input.role?.trim()) {
    throw new ValidationError("Company and role are required");
  }
  if (!isValidStatus(input.status)) {
    throw new ValidationError("Invalid status");
  }

  const now = new Date().toISOString();
  const id = randomUUID();
  const item: DynamoApplicationItem = {
    PK: userPk(userId),
    SK: appSk(id),
    id,
    company: input.company.trim(),
    role: input.role.trim(),
    status: input.status,
    appliedAt: input.appliedAt?.trim() || undefined,
    jobUrl: input.jobUrl?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await client.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return toApplication(item);
}

export async function updateApplication(
  userId: string,
  applicationId: string,
  input: UpdateApplicationInput
): Promise<Application> {
  const updates: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};

  if (input.company !== undefined) {
    if (!input.company.trim()) throw new ValidationError("Company is required");
    updates.push("#company = :company");
    names["#company"] = "company";
    values[":company"] = input.company.trim();
  }
  if (input.role !== undefined) {
    if (!input.role.trim()) throw new ValidationError("Role is required");
    updates.push("#role = :role");
    names["#role"] = "role";
    values[":role"] = input.role.trim();
  }
  if (input.status !== undefined) {
    if (!isValidStatus(input.status)) {
      throw new ValidationError("Invalid status");
    }
    updates.push("#status = :status");
    names["#status"] = "status";
    values[":status"] = input.status;
  }
  if (input.appliedAt !== undefined) {
    updates.push("#appliedAt = :appliedAt");
    names["#appliedAt"] = "appliedAt";
    values[":appliedAt"] = input.appliedAt.trim() || null;
  }
  if (input.jobUrl !== undefined) {
    updates.push("#jobUrl = :jobUrl");
    names["#jobUrl"] = "jobUrl";
    values[":jobUrl"] = input.jobUrl.trim() || null;
  }
  if (input.notes !== undefined) {
    updates.push("#notes = :notes");
    names["#notes"] = "notes";
    values[":notes"] = input.notes.trim() || null;
  }

  if (updates.length === 0) {
    throw new ValidationError("No fields to update");
  }

  const now = new Date().toISOString();
  updates.push("#updatedAt = :updatedAt");
  names["#updatedAt"] = "updatedAt";
  values[":updatedAt"] = now;

  const result = await client.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: userPk(userId),
        SK: appSk(applicationId),
      },
      UpdateExpression: `SET ${updates.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ConditionExpression: "attribute_exists(PK)",
      ReturnValues: "ALL_NEW",
    })
  );

  return toApplication(result.Attributes as DynamoApplicationItem);
}

export async function deleteApplication(
  userId: string,
  applicationId: string
): Promise<void> {
  await client.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: userPk(userId),
        SK: appSk(applicationId),
      },
      ConditionExpression: "attribute_exists(PK)",
    })
  );
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
