import Route from "@ember/routing/route";

export default class InfoRoute extends Route {
  model() {
    return {
      support: {
        phone: "+41 61 500 31 30",
        email: "support@adfinis.com",
      },
      profiles: [
        {
          title: "LinkedIn",
          address: "https://www.linkedin.com/company/adfinis-com",
          icon: "linkedin",
        },
        {
          title: "Twitter",
          address: "https://twitter.com/adfinis",
          icon: "twitter",
        },
        {
          title: "GitHub",
          address: "https://github.com/adfinis-sygroup",
          icon: "github",
        },
      ],
    };
  }
}
