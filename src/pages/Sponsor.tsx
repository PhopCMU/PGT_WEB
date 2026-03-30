import { getUserFromToken } from "../utils/authService";

export default function Sponsor() {
  const user = getUserFromToken();
  console.log(user);

  return <div>Sponsor</div>;
}
