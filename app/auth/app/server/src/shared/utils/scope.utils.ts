import { Scope } from "shared/enums/scopes.enums.ts";
import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import { compareIps, getIpFromRequest } from "@oh/utils";

type Props = {
  request: Request;
  scopes?: Scope[];
  admin?: boolean;
};

export const hasRequestAccess = async ({
  request,
  scopes = ["ACCOUNT_ONLY" as Scope],
  admin = false,
}: Props): Promise<boolean> => {
  const accountId = request.headers.get("account-id");
  const token = request.headers.get("token");

  const connectionToken = request.headers.get("connection-token");
  const licenseToken = request.headers.get("license-token");

  if (accountId && token) {
    const userAgent = request.headers.get("user-agent");
    const ip = getIpFromRequest(request);

    const accountsByToken = await System.db.get(["accountsByToken", accountId]);

    if (
      !accountsByToken ||
      accountsByToken.userAgent !== userAgent ||
      !compareIps(ip, accountsByToken.ip)
    )
      return false;

    if (admin && !(await System.db.get(["adminsByAccountId", accountId])))
      return false;

    return bcrypt.compareSync(token, accountsByToken.tokenHash);
  }

  if (scopes.includes("ACCOUNT_ONLY" as Scope)) return false;

  if (connectionToken && licenseToken)
    return (
      (await System.connections.verify(connectionToken, scopes)) &&
      (await System.licenses.verify(licenseToken))
    );

  return false;
};
