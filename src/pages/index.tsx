import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Dumbbell, Heart } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        localStorage.removeItem("user");
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  const handleLoginRedirect = () => router.push("/login");
  const handleRegisterRedirect = () => router.push("/register");
  const handleHomeRedirect = () => router.push("/home");

  // Animációs variánsok
  const heroVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const textContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.6, ease: "easeOut" },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <div className="relative h-full w-full bg-white overflow-hidden">
      {/* Parallax háttér */}
      <div className="absolute h-full w-full bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero szakasz */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="text-center max-w-3xl"
        >
          <Image
            src="/images/Logo_original.png"
            width={100}
            height={100}
            alt="Logo"
            className="mx-auto mb-4"
          />
          <motion.h1
            variants={textContainer}
            initial="hidden"
            animate="visible"
            className="text-4xl font-extrabold text-[#1D1617]"
          >
            {"Üdvözlünk az ".split("").map((char, index) => (
              <motion.span key={index} variants={textVariant}>
                {char}
              </motion.span>
            ))}
            <motion.span className="text-[#FF6000]" variants={textVariant}>
              {"RK_GymShop"}
            </motion.span>
            {"-ban!".split("").map((char, index) => (
              <motion.span key={`end-${index}`} variants={textVariant}>
                {char}
              </motion.span>
            ))}
          </motion.h1>
          {user ? (
            <motion.p
              variants={heroVariants}
              className="mt-6 text-[#454545] text-lg"
            >
              Üdvözöljük, <strong>{user.name}</strong>! Böngéssz a legjobb
              edzőfelszereléseink között.
            </motion.p>
          ) : (
            <motion.p
              variants={heroVariants}
              className="mt-4 text-[#454545] text-lg"
            >
              Csatlakozz hozzánk és kezdd el a fitnesz utadat prémium
              felszerelésekkel.
            </motion.p>
          )}
        </motion.div>

        {/* Fő funkciók */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-4xl">
          {[
            {
              icon: Dumbbell,
              title: "Edzőfelszerelések",
              description:
                "Találd meg a legjobb súlyzókat, edzőszőnyegeket és gépeket.",
            },
            {
              icon: Heart,
              title: "Egészséges életmód",
              description:
                "Válogass a táplálékkiegészítők és vitaminok széles választékából.",
            },
            {
              icon: ShoppingCart,
              title: "Könnyű vásárlás",
              description:
                "Egyszerű és biztonságos online vásárlási élményt nyújtunk.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition-transform"
            >
              <item.icon className="mx-auto text-[#FF6000]" size={40} />
              <h3 className="text-xl font-bold text-[#1D1617] mt-4">
                {item.title}
              </h3>
              <p className="text-[#454545] mt-2 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call-to-Action szakasz */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
          {user ? (
            <>
              <motion.button
                onClick={handleLogout}
                className="bg-[#FF6000] w-36 text-white py-2 px-4 rounded-md shadow font-medium text-md hover:bg-[#FFA559]"
                variants={buttonVariants}
                whileHover="hover"
              >
                Kijelentkezés
              </motion.button>
              <motion.button
                onClick={handleHomeRedirect}
                className="bg-[#1D1617] w-36 text-white py-2 px-4 rounded-md shadow font-medium text-md hover:bg-[#454545]"
                variants={buttonVariants}
                whileHover="hover"
              >
                Home
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                onClick={handleRegisterRedirect}
                className="bg-[#FF6000] w-36 text-white py-2 px-4 rounded-md shadow font-medium text-md hover:bg-[#FFA559]"
                variants={buttonVariants}
                whileHover="hover"
              >
                Regisztráció
              </motion.button>
              <motion.button
                onClick={handleLoginRedirect}
                className="bg-[#1D1617] w-36 text-white py-2 px-4 rounded-md shadow font-medium text-md hover:bg-[#454545]"
                variants={buttonVariants}
                whileHover="hover"
              >
                Bejelentkezés
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
