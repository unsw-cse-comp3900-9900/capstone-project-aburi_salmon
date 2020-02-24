import { NextPage } from "next";

const Home: NextPage<{ userAgent: string }> = ({ userAgent }) => (
    <h1>Hello world! - user agent: {userAgent}</h1>
);

Home.getInitialProps = async ({ req }) => {
    const userAgent = req
        ? req.headers["user-agent"] || ""
        : navigator.userAgent;
    return { userAgent };
};

// This is the default landing page (base path)
export default Home;
