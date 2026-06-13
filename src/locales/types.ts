export interface Translation {
  navigation: {
    home: string;
    services: string;
    team: string;
    story: string;
    career: string;
    contact: string;
  };
  hero: {
    learn: {
      title: string;
      metaTitle: string;
      description: string;
    };
    inspire: {
      title: string;
      metaTitle: string;
      description: string;
    };
    grow: {
      title: string;
      metaTitle: string;
      description: string;
    };
    landing: {
      slogan: string;
    }
  };
  services: {
    title: string;
    subtitle: string;
    items: {
      web: { title: string; description: string; };
      mobile: { title: string; description: string; };
      fullstack: { title: string; description: string; };
      minecraft: { title: string; description: string; };
    }
  };
  story: {
    title: string;
    subtitle: string;
    slides: {
      slide1: { date: string; title: string; subtitle: string; p1: string; p2: string; };
      slide2: { date: string; title: string; subtitle: string; p1: string; p2: string; p3: string; };
    }
  };
  careers: {
    title: string;
    subtitle: string;
    items: {
      nekoai: { description: string; };
      nekocomics: { description: string; };
      nekoanime: { description: string; };
    }
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    form: {
      name: string;
      email: string;
      message: string;
      submit: string;
      submitting: string;
      success: string;
    }
  };
  sideProjects: {
    title: string;
    subtitle: string;
    items: {
      nekobuckets: {
        description: string;
      };
      nekomusics: {
        description: string;
      };
      nekocomicsLegacy: {
        description: string;
      };
    };
    actions: {
      invite: string;
      viewSource: string;
      viewFrontend: string;
      viewBackend: string;
    }
  };
}
