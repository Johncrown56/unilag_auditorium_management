import { Disclosure } from "@headlessui/react";
import { HiChevronUp } from "react-icons/hi2";
import { faqdata } from "../../utils/constant";
import SectionTitle from "../../components/sectionTitle";

const Faq = () => {
  return (
    <div className={`container mx-auto xl:px-0 lg:px-8 py-24 lg:py-24 sm:py-32`}>
        <SectionTitle title="Frequently Asked Questions">
        Check out our frequently asked questions below, if your question is still unanswered, you can contact us or visit Auditorium Management Office.
      </SectionTitle>

      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item, index) => (
          <div key={item.question+index} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                    <span>{item.question}</span>
                    <HiChevronUp
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-primary-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                    {item.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faq;