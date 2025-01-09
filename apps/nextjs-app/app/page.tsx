import { redirect} from "next/navigation";
import { auth } from "@repo/next-auth/auth";

export default function Home() {

  const session = auth()
  if(session){
    redirect('/home')
  }else{
    redirect('/landing')
  }
}
