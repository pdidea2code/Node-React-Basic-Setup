import { Response } from "express";

// Utility function to create a response for a successful resource creation
export const createResponse = (res: Response, data: any): void => {
  res.status(201).json({ isSuccess: true, status: 201, info: data });
};

// Utility function to create an error response related to query issues
export const queryErrorRelatedResponse = (
  res: Response,
  status: number = 400,
  message: string
): void => {
  res.status(status).json({ isSuccess: false, status, message });
};

// Utility function to send a standard success response
export const successResponse = (
  res: Response,
  data: any,
  baseUrl: string | null = null
): void => {
  const responsePayload: { isSuccess: true; status: number; info: any; baseUrl?: string } = {
    isSuccess: true,
    status: 200,
    info: data,
  };
  if (baseUrl) responsePayload.baseUrl = baseUrl;

  res.status(200).json(responsePayload);
};

// Utility function to send a response for a successful deletion
export const deleteResponse = (res: Response, message: string): void => {
  res.status(202).json({ isSuccess: true, status: 202, message });
};
