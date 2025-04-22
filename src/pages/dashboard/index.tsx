import {Dashboard} from "components";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

export default function DashboardPage() {
    return <Dashboard />;
}

//not utilised, do we need it?

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
      },
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
};