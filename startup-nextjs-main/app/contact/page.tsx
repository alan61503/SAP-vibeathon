import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page | Free Next.js Template for Startup and SaaS",
  description: "This is Contact Page for Startup Nextjs Template",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Page"
        description="We'd love to hear from you! For questions, support, or partnership opportunities, please reach out using the form below or call us at +91 9544799865. Our team is here to help students and professionals connect, collaborate, and succeed."
      />

      <Contact phoneNumber={"+91 9544799865"} />
    </>
  );
};

export default ContactPage;
