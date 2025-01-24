import { LoginForm } from "components";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

export default function LoginPage() {
  return <LoginForm />;
}

//if session already exists then redirect to dashboard
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};