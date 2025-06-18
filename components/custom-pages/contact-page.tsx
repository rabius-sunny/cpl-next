'use client'
import BouncyLink from "@/components/common/BouncyLink";
import ContactForm from "@/components/common/contact-form";
import { cn } from "@/lib/utils";
import { motion } from 'motion/react';

type TProps = {
    data: FooterSection
}

export default function ContactPageContent({ data }: TProps) {
    return (
        <>
            {/* Map & Office Info Section */}
            <section id="about_us" className="relative bg-white py-28">
                <div className="z-10 relative">
                    <div className="space-y-28 mx-auto px-4 max-w-7xl container">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="space-y-16 bg-white lg:shadow-xl ml-0 p-5 lg:p-16 rounded-sm w-full max-w-2xl"
                        >
                            {/* Corporate Office */}
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <h2 className="font-bold text-primary text-4xl">Corporate Office</h2>
                                <div className="leading-loose">
                                    {data?.office?.items?.map((data, idx) => (
                                        <p key={idx} className={cn({ "mb-4": idx === 1 })}>{data}</p>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Factory Office */}
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <h2 className="font-bold text-primary text-4xl">Factory Office</h2>
                                <div className="leading-loose">
                                    {data?.factory?.items?.map((data, idx) => (
                                        <p key={idx} className={cn({ "mb-4": idx === 1 })}>{data}</p>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Buttons */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="relative gap-5 grid grid-cols-none sm:grid-cols-2 w-full"
                            >
                                <BouncyLink
                                    href="/green-initiative"
                                    className="inline-block relative bg-primary px-6 py-4 rounded-lg w-full font-semibold text-white text-center"
                                >
                                    Contact
                                </BouncyLink>
                                <BouncyLink
                                    href="https://maps.app.goo.gl/UKndAwBDfq8CV1Vc9"
                                    target="_blank"
                                    className="inline-block relative bg-primary px-6 py-4 rounded-lg w-full font-semibold text-white text-center"
                                >
                                    See Google Map
                                </BouncyLink>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Background Map */}
                <div className="z-0 absolute inset-0 bg-amber-100">
                    <div className="z-0 absolute inset-0 bg-gray-900/50" />
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.3606233548885!2d90.39973265567373!3d23.770169350996646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b50c1e86a5%3A0x434c9c95fc5b6730!2sSena%20Kalyan%20Business%20Mart!5e0!3m2!1sen!2sbd!4v1750228617631!5m2!1sen!2sbd"
                        className="w-full h-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="about_us" className="bg-white py-28">
                <div className="space-y-28 mx-auto px-4 max-w-7xl container">
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-14 mx-auto p-4 w-full max-w-3xl"
                    >
                        <h2 className="font-bold text-4xl text-center">
                            Get in <span className="text-primary">Touch</span>
                        </h2>
                        <ContactForm />
                    </motion.div>
                </div>
            </section>
        </>
    )
}
