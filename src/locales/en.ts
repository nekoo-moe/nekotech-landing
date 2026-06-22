import { Translation } from './types';

const en: Translation = {
  navigation: {
    home: 'Home',
    services: 'Services',
    team: 'Team',
    story: 'About us',
    career: 'Our Project',
    partners: 'Partners',
    contact: 'Contact'
  },
  hero: {
    learn: {
      title: 'Learn',
      metaTitle: "We're young developer",
      description: "We are a team of ambitious young developers dedicated to building high-impact solutions. By combining our passion for clean code with daily innovation, we transform complex ideas into extraordinary digital experiences, aiming to redefine the future of technology."
    },
    inspire: {
      title: 'Inspire',
      metaTitle: "Empowered by passion",
      description: "Empowered by passion, we are young developers on a mission to democratize technology. Through our courses, we bridge the gap between curiosity and creation—sparking a community where innovation thrives. To us, coding isn't just about syntax; it’s about solving real-world problems and inspiring the next generation of changemakers."
    },
    grow: {
      title: 'Grow',
      metaTitle: "Better together, day by day",
      description: "More than just code—we’re building the future. We are a team of young developers who live for the \"Aha!\" moment of a finished project. Through collaboration and relentless curiosity, we transform raw ideas into powerful digital experiences, growing stronger with every line we ship."
    },
    landing: {
      slogan: "simply advanced your technology"
    }
  },
  services: {
    title: 'Our Services',
    subtitle: 'What we can do for you...',
    items: {
      web: {
        title: 'Web Development',
        description: 'Building responsive, high-performance websites tailored to your needs using modern frameworks and best practices. We ensure your online presence is robust, secure, and visually appealing.'
      },
      mobile: {
        title: 'Mobile Applications',
        description: 'Creating seamless mobile experiences for both iOS and Android platforms. Our apps are designed for performance, usability, and to keep your users engaged on the go.'
      },
      fullstack: {
        title: 'Full-Stack Applications',
        description: 'We build full-stack solutions that are as robust as they are user-friendly. From architecting scalable APIs to crafting dynamic user interfaces, we handle the entire development lifecycle to turn your most ambitious ideas into fully functional realities.'
      },
      minecraft: {
        title: 'Minecraft Server',
        description: "We create Minecraft servers that are not just fun but also secure and engaging. Whether you're building a survival realm or a creative hub, we ensure your server is optimized for performance and player experience."
      }
    }
  },
  sideProjects: {
    title: "Side Projects",
    subtitle: "Other cool stuff we've built",
    items: {
      nekobuckets: {
        description: "NekoBuckets - A masterpiece by Heiznerd. A comprehensive, smooth-operating Discord bot designed to meet every management and entertainment need of your community."
      },
      nekomusics: {
        description: "NekoMusics - An open-source project by Heiznerd. Bringing a vivid world of high-quality music directly to your Discord server."
      }
    },
    actions: {
      invite: "Invite Bot",
      viewSource: "View Source",
      viewFrontend: "View Frontend",
      viewBackend: "View Backend"
    }
  },
  story: {
    title: 'Our Journey',
    subtitle: 'Journey from the beginning...',
    slides: {
      slide1: {
        date: "SEP 26, 2025",
        title: "Code and learn<br> With Passion",
        subtitle: "The beginning of NekoTech Foundation",
        p1: "Founded by akk1to in <strong>September 26, 2025</strong>. We began as a small Discord group with a single goal: recreating a manga reader. That initial project laid the foundation for the team we are today—a group of passionate developers building innovative tools and impressive digital experiences.",
        p2: "Currently our core team have three members: <strong>@ssdarealest (alyosha)</strong>, <strong>@captainnhwuy (Heiznerd)</strong>, <strong>@maiminhdung</strong>."
      },
      slide2: {
        date: "DEC 18, 2025",
        title: "learn together. <br>grow together.",
        subtitle: "Our passion",
        p1: "We are a collective of developers who have logged countless hours learning, coding, and working on our projects together. Today, we are building <strong>NekoAI</strong>, <strong>NekoStream</strong>, <strong>Fujiwara</strong> and more.",
        p2: "Connect with a team of driven students to learn, work, and grow together. We believe that by constantly pushing our limits, we only get better.",
        p3: "<strong>Apply to join today:</strong> works.nekotech@proton.me"
      }
    }
  },
  careers: {
    title: 'Our Projects',
    subtitle: 'Check out the products we are shipping.',
    items: {
      nekoai: {
        description: "NekoAI is a 2D AI Agent, inspired by Neuro-sama, built to help people do the job!"
      },
      nekostream: {
        description: "NekoStream is a Vietnamese streaming platform built for anime fans who are tired of ads, region locks, and terrible UI. Fast, clean, and community-first."
      },
      nekostreamCli: {
        description: "NekoStream CLI — watch everything from your terminal. A no-nonsense command-line client for NekoStream, built for developers and power users who live in the shell."
      },
      fujiwara: {
        description: "Fujiwara Shin is your org's personal Discord bot — built by NekoTech, shaped for you. Moderation, music, leveling, custom commands. Forget cookie-cutter bots. Fujiwara does exactly what your server needs, nothing else. We deploy, we maintain, you own it."
      }
    }
  },
  contact: {
    title: "Contact Us",
    subtitle: "Let's build something together",
    description: "Have a project in mind or want to join our team? Send us a message!",
    form: {
      name: "Your Name",
      email: "Email Address",
      message: "Message",
      submit: "Send Message",
      submitting: "Sending...",
      success: "Message sent successfully!"
    }
  }
};

export default en;
