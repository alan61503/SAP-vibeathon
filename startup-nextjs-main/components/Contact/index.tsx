// ...existing code...

interface ContactProps {
  phoneNumber?: string;
}

const Contact = ({ phoneNumber = "+91 9544799865" }: ContactProps) => {
  return (
  <section id="contact" className="overflow-hidden py-24 md:py-32 lg:py-40">
  <div className="container mx-auto px-6">
  <div className="-mx-4 flex flex-wrap gap-y-12 gap-x-8 justify-center">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12 flex flex-col justify-center items-center">
            <div
              className="wow fadeInUp shadow-three dark:bg-gray-dark mb-16 rounded-lg bg-white px-12 py-16 sm:p-[70px] lg:mb-10 lg:px-12 xl:p-[70px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-6 text-3xl font-bold text-black dark:text-white sm:text-4xl lg:text-3xl xl:text-4xl text-center">
                Need Help? Open a Ticket
              </h2>
              <p className="mb-4 text-lg font-medium text-body-color text-center">
                Our support team will get back to you ASAP via email or phone.
              </p>
              <p className="mb-10 text-lg font-medium text-body-color text-center">
                <span className="font-semibold text-primary">Contact Number:</span> <a href={`tel:${phoneNumber}`} className="hover:underline">{phoneNumber}</a>
              </p>
              <form>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        placeholder="Enter your Message"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button className="shadow-submit dark:shadow-submit-dark rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
                      Submit Ticket
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* Additional content or layout can go here if needed */}
        </div>
      </div>
    </section>
  );
};

export default Contact;
