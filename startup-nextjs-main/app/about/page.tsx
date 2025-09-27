import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Page | Free Next.js Template for Startup and SaaS",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Page"
        description="Welcome to a vibrant hub for students and professionals! Our platform is dedicated to empowering you with hands-on learning, networking opportunities, and career growth. Whether you are a student eager to gain real-world skills or a professional looking to upskill, collaborate, or mentor, you'll find interactive workshops, expert talks, and innovative resources tailored for your journey. Join us to connect, learn, and thrive in a community that values curiosity, ambition, and lifelong learning."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
