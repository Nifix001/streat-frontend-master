import { authOptions } from "./api/auth";
import { getServerSession } from "next-auth";

export const isAuthorized = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};
