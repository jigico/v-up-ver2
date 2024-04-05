// app>api>auth>[...nextauth]>route.ts
import { supabase } from "@/shared/supabase/supabase";
import NextAuth, { SessionOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "email-password-credential",
      name: "Credentials",
      credentials: {
        email: {
          label: "이메일",
          type: "email",
        },
        password: {
          label: "비밀번호",
          type: "password",
        },
      },
      async authorize(credentials, _) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("이메일과 비밀번호를 입력하세요.");
        }

        const { email, password } = credentials;
        const { data, error } = await supabase
          .from("userInfo")
          .select("userId, email, nickname, password")
          .eq("email", email)
          .single();
        console.log(data);

        if (error) {
          throw new Error("에러가 났습니다.");
        }
        if (data && credentials && data?.password !== password) {
          throw new Error("비밀번호가 다릅니다.");
        }

        if (!data) {
          throw new Error("해당 이메일이 없습니다.");
        }

        const spendSessionUserInfo = {
          id: data.userId,
          email: data.email,
          nickname: data.nickname,
        };

        return spendSessionUserInfo;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
