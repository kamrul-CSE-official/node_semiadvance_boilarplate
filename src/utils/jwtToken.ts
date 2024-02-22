import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import env from "../configs/envConfig";

interface JwtPayload {
  [key: string]: any;
}

const createRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.refreshTokenSecret as string, {
    expiresIn: env.refreshTokenExpiresIn,
    algorithm: "HS384",
  });
};

const createAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.accessTokenSecret as string, {
    expiresIn: env.accessTokenExpiresIn,
    algorithm: "HS512",
  });
};

const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res
      .status(403)
      .json({ message: "Forbidden access", status: "fail" });
  }

  jwt.verify(
    refreshToken,
    env.refreshTokenSecret as string,
    (err: any, decoded: any) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Forbidden access", status: "fail" });
      }
      (req as any).refreshTokenData = decoded;
      next();
    }
  );
};

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken: string | undefined =
    req.headers?.authorization?.split(" ")[1];
  if (!accessToken) {
    return res
      .status(403)
      .json({ message: "Forbidden access", status: "fail" });
  }

  jwt.verify(
    accessToken,
    env.accessTokenSecret as string,
    (err: any, decoded: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          // If token is expired, generate a new access token and attach it to the response
          const newAccessToken = createAccessToken(decoded);
          return res.status(401).json({
            message: "Access token expired",
            status: "fail",
            accessToken: newAccessToken,
          });
        } else {
          return res
            .status(403)
            .json({ message: "Forbidden access", status: "fail" });
        }
      }
      (req as any).accessTokenData = decoded;
      next();
    }
  );
};

export{
  createRefreshToken,
  createAccessToken,
  verifyRefreshToken,
  verifyAccessToken,
};
