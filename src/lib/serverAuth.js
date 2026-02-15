import { getAdminToken } from "./auth";

/**
 * Server-side authentication check for admin routes
 * usage: export const getServerSideProps = requireAdmin;
 */
export const requireAdmin = async (context) => {
  const { req } = context;
  const token = req.cookies.adminToken;

  if (!token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
