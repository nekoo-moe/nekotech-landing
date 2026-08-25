import { Translation } from './types';

/**
 * Vietnamese is a translation, not a transliteration: the English copy is
 * terse because English can be, and Vietnamese sentences get the connectors
 * they need to read naturally out loud. Product names stay in English.
 */
const vi: Translation = {
  meta: {
    tagline: 'Chúng tôi làm sản phẩm công khai.',
    description:
      'NekoTech Foundation là một nhóm developer Việt Nam xây dựng AI agent, hạ tầng streaming và công cụ cho developer — công khai từ commit đầu tiên.',
  },

  nav: {
    showcase: 'Đã hoàn thành',
    partners: 'Đối tác',
    work: 'Sản phẩm',
    services: 'NekoAI',
    capabilities: 'Năng lực',
    trajectory: 'Hành trình',
    team: 'Đội ngũ',
    contact: 'Liên hệ',
    sideProjects: 'Dự án phụ',
  },

  a11y: {
    skipToContent: 'Chuyển tới nội dung chính',
    openMenu: 'Mở menu điều hướng',
    closeMenu: 'Đóng menu điều hướng',
    switchTo: 'Chuyển sang tiếng Anh',
    externalLink: 'mở trong tab mới',
    scrollHint: 'Cuộn để xem tiếp',
    mainNav: 'Điều hướng chính',
  },

  hero: {
    eyebrow: 'NekoTech Foundation · Bắt đầu từ 09/2025',
    headline: ['Chúng tôi', 'làm sản phẩm', 'công khai.'],
    lede:
      'Một nhóm developer Việt Nam xây dựng AI agent, hạ tầng streaming và công cụ cho developer. Mọi commit đều công khai. Mọi quyết định đều được ghi lại.',
    primaryCta: 'Xem chúng tôi làm gì',
    secondaryCta: 'Tham gia cùng chúng tôi',
  },

  signal: {
    label: 'Số liệu',
    heading: 'Đo được, không phải nói suông.',
    lede:
      'Lấy trực tiếp từ GitHub org khi build. Số liệu thay đổi thì trang này thay đổi theo.',
    members: 'Thành viên',
    repositories: 'Repository',
    privateSuffix: 'riêng tư',
    stars: 'Sao',
    commits: 'commit',
    commitsWindow: '52 tuần gần nhất',
    weekLabel: 'Tuần',
    less: 'Ít',
    more: 'Nhiều',
    busiestRepo: 'Repository nhiều commit nhất',
    acrossRepos: 'trên {n} repository',
    languages: 'Ngôn ngữ chúng tôi dùng',
    orgLink: 'Xem org trên GitHub',
    stale: 'Ảnh chụp — cập nhật lại mỗi lần deploy',
  },

  showcase: {
    label: 'Đã hoàn thành',
    heading: 'Những thứ đã chạy thật.',
    lede:
      'Bốn thứ chúng tôi đã làm xong và vẫn đang bảo trì. Cái nào cũng có người dùng thật, không phải chúng tôi.',
    liveLabel: 'Đang chạy',
    caseLabel: 'Dự án',
    viewLabel: 'Xem',
    resultLabel: 'Kết quả',
    items: {
      nekobuckets: {
        tag: 'Discord bot',
        summary:
          'Một Discord bot đa dụng, lo phần quản trị và giải trí mà cộng đồng thực sự cần, không kèm gói dashboard trả phí.',
        result: 'Chạy thật từ 12/2025',
      },
      nekomusics: {
        tag: 'Discord bot · Mã nguồn mở',
        summary:
          'Bot nhạc mã nguồn mở. Âm thanh chất lượng cao trong voice channel, không có gói premium chặn hàng chờ.',
        result: 'Mã nguồn mở · không thu phí hàng chờ',
      },
      coffoxmc: {
        tag: 'Game server · Việc khách hàng',
        summary:
          'Vận hành kỹ thuật cho LangBangVN — CoffoxMC: plugin, chống gian lận, backup và tối ưu để server đông người không bị giật.',
        result: 'Đối tác kỹ thuật từ 01/2026',
      },
      fujiwara: {
        tag: 'Discord bot · Làm riêng',
        summary:
          'Một Discord bot làm riêng cho một server thay vì cho hàng trăm nghìn server: quản trị, nhạc, level và lệnh tuỳ chỉnh, do chúng tôi triển khai và bảo trì.',
        result: 'Đã triển khai, được bảo trì, khách hàng sở hữu',
      },
    },
  },

  services: {
    label: 'Dịch vụ',
    heading: 'NekoAI, và nó làm được gì cho bạn.',
    lede:
      'Sản phẩm chúng tôi đang kinh doanh, gói trong bốn khung. Mọi thứ còn lại trên trang này là bối cảnh cho nó.',
    pitch:
      'Người bạn đồng hành số của riêng bạn, sống ngay trong thiết bị của bạn, lo việc thường ngày chỉ bằng một câu lệnh! Để bạn tự làm chủ đời sống số của mình — dễ dàng, ở đâu cũng được, lúc nào cũng được.',
    productName: 'NekoAI',
    productTag: 'Người bạn đồng hành số',
    slides: [
      {
        kicker: 'Đồng hành',
        title: 'Nó sống trong thiết bị của bạn.',
        body:
          'Không phải một tab trình duyệt bạn cứ quên mất. NekoAI chạy ngay nơi bạn đang làm việc, có mặt, có giọng, và nhớ hôm qua bạn đã hỏi gì.',
      },
      {
        kicker: 'Một câu lệnh',
        title: 'Việc thường ngày, gói trong một dòng.',
        body:
          'File, lời nhắc, tìm kiếm, script, tin nhắn. Bạn nói một lần; agent tự chọn công cụ rồi báo lại đúng những gì nó đã làm.',
      },
      {
        kicker: 'Làm chủ',
        title: 'Tự làm chủ đời sống số.',
        body:
          'Dữ liệu vẫn là của bạn: lưu ưu tiên trên máy, bộ nhớ xuất ra được, và câu trả lời rõ ràng cho việc gì đã gửi đi đâu. Không đồng bộ ngầm.',
      },
      {
        kicker: 'Mọi nơi',
        title: 'Dễ dàng, ở đâu cũng được, lúc nào cũng được.',
        body:
          'Máy tính, điện thoại, terminal — vẫn một người đồng hành với cùng một bộ nhớ, trên bất cứ màn hình nào bạn đang cầm.',
      },
    ],
    cta: 'Trao đổi với chúng tôi về NekoAI',
    ctaNote: 'Beta công khai mở Q3 2026 · truy cập sớm theo yêu cầu',
    prev: 'Khung trước',
    next: 'Khung sau',
    goTo: 'Tới khung {n}',
  },

  work: {
    label: 'Sản phẩm',
    heading: 'Bốn sản phẩm, một hệ sinh thái.',
    lede:
      'Tất cả những gì bên dưới đều đang chạy thật hoặc đang được phát triển. Không có cái nào dựng ra chỉ để trình bày.',
    statuses: {
      active: 'Đang chạy',
      development: 'Đang phát triển',
      planned: 'Đã lên kế hoạch',
    },
    items: {
      nekoai: {
        tag: 'AI agent',
        summary:
          'Một AI companion 2D biết stream, biết phản hồi và làm được việc — lấy cảm hứng từ Neuro-sama nhưng hướng tới hữu dụng thật. Giọng nói, bộ nhớ và khả năng dùng tool trong một agent.',
      },
      nekostream: {
        tag: 'Nền tảng streaming',
        summary:
          'Nền tảng xem anime cho người Việt đã quá mệt với quảng cáo pop-up, chặn vùng và player khó dùng. Nhanh, gọn, đặt cộng đồng lên trước.',
      },
      nekostreamCli: {
        tag: 'CLI',
        summary:
          'Vẫn thư viện đó, không cần trình duyệt. Client terminal cho NekoStream: tìm, thêm vào hàng chờ và phát ngay trong shell bạn đang dùng.',
      },
      fujiwara: {
        tag: 'Discord bot',
        summary:
          'Một Discord bot làm riêng cho một server, không phải cho hàng trăm nghìn server. Quản trị, nhạc, level, lệnh tuỳ chỉnh — chúng tôi triển khai, chúng tôi bảo trì, bạn sở hữu.',
      },
    },
    sideProjectsCta: 'Dự án phụ',
  },

  capabilities: {
    label: 'Năng lực',
    heading: 'Những việc bạn có thể thuê chúng tôi làm.',
    lede:
      'Bốn thứ chúng tôi làm tới. Chúng tôi thà từ chối còn hơn nhận việc chưa từng làm ra sản phẩm thật.',
    items: {
      product: {
        tag: 'Web · Frontend',
        summary:
          'Giao diện sản phẩm làm để dùng lâu dài: accessibility thật, ngân sách hiệu năng thật, xử lý đầy đủ trạng thái loading, rỗng và lỗi. Vue, React, TypeScript.',
      },
      platform: {
        tag: 'Backend · Hạ tầng',
        summary:
          'API, mô hình dữ liệu và pipeline triển khai. Dùng Rust và Node ở nơi cần thiết, Postgres làm mặc định, giám sát từ ngày đầu chứ không phải sau sự cố đầu tiên.',
      },
      bots: {
        tag: 'Discord · Tự động hoá',
        summary:
          'Discord bot và tự động hoá cho cộng đồng: quản trị, ticket, nhạc, luồng tuỳ chỉnh. Xây, host và bàn giao kèm tài liệu.',
      },
      gameservers: {
        tag: 'Máy chủ game',
        summary:
          'Dựng và tinh chỉnh máy chủ Minecraft — plugin, chống gian lận, backup và phần tối ưu hiệu năng để server đông người không bị giật.',
      },
    },
  },

  trajectory: {
    label: 'Hành trình',
    heading: 'Từ một nhóm Discord thành một org.',
    lede:
      'Một đường liền mạch: chúng tôi bắt đầu từ đâu, và điều gì đã được lên lịch.',
    shipped: 'Đã làm',
    next: 'Tiếp theo',
    items: {
      founded: {
        date: '09/2025',
        title: 'Thành lập',
        body:
          'akk1to lập một nhóm Discord với đúng một mục tiêu: làm lại một trình đọc manga cho ra sản phẩm. Ba developer, cùng một thói quen làm tới cùng.',
      },
      firstShip: {
        date: '12/2025',
        title: 'Sản phẩm đầu tiên',
        body:
          'NekoBuckets và NekoMusics lên sóng. Nhóm chat trở thành một đội có người dùng thật.',
      },
      growth: {
        date: 'Đầu 2026',
        title: 'Org định hình',
        body:
          'NekoAI, NekoStream và Fujiwara bước vào phát triển. Có contributor đầu tiên từ ngoài ba người sáng lập. Bắt đầu hợp tác với LangBangVN.',
      },
      nekoaiBeta: {
        date: 'Q3 2026',
        title: 'NekoAI beta công khai',
        body:
          'Agent 2D mở cho cộng đồng thử. Nhận báo lỗi, đọc yêu cầu tính năng, roadmap công khai.',
      },
      nekostreamLaunch: {
        date: 'Q4 2026',
        title: 'NekoStream ra mắt',
        body:
          'Ra mắt nền tảng streaming: không quảng cáo chen ngang, không chặn vùng, player chạy được trên máy đời năm năm trước.',
      },
      platform: {
        date: '2027',
        title: 'Một nền tảng chung',
        body:
          'Đăng nhập một lần cho mọi sản phẩm NekoTech và một API công khai, để thứ chúng tôi làm cho mình trở thành thứ người khác xây tiếp được.',
      },
    },
  },

  partners: {
    label: 'Đối tác',
    heading: 'Những người tin chúng tôi từ sớm.',
    lede:
      'Hai đối tác, cả hai vẫn đang hoạt động. Thà kể hai cái thật còn hơn trưng hai mươi cái logo.',
    visit: 'Vào website',
    discord: 'Discord',
    ctaLead: 'Muốn hợp tác?',
    ctaLink: 'Cho chúng tôi biết bạn cần gì',
    items: {
      langbangvn: {
        name: 'LangBangVN — CoffoxMC',
        tag: 'Máy chủ Minecraft',
        badge: 'Hoạt động 5 năm',
        summary:
          'Máy chủ Minecraft Việt Nam hoạt động nhiều năm, các cụm chơi được làm tử tế và lượng người chơi ổn định. NekoTech phụ trách phần kỹ thuật từ tháng 1/2026.',
      },
      nekostudio: {
        name: 'NekoStudio',
        tag: 'Dịch vụ Discord',
        badge: 'Discord · Bot tuỳ chỉnh',
        summary:
          'Setup Discord bot, làm bot theo yêu cầu và cấu hình server, do Alyosha và Heiznerd vận hành. Nhánh thương mại của cùng đội ngũ.',
      },
    },
  },

  team: {
    label: 'Đội ngũ',
    heading: 'Bốn người, không ai đứng cho đủ.',
    lede: 'Đội nòng cốt. Ở đây ai cũng viết code được đưa lên sản phẩm.',
    roles: {
      lead: 'Trưởng nhóm · Backend',
      frontend: 'Frontend',
      backend: 'Backend · Mobile',
      deploy: 'Fracs Deploy · Xử lý PR',
    },
    osuProfile: 'Trang osu!',
    website: 'Trang cá nhân',
    showMember: 'Xem {name}',
    featured: 'Đang xem',
  },

  contact: {
    label: 'Liên hệ',
    heading: ['Chúng tôi làm', 'công khai.'],
    lede:
      'Góp code, thuê chúng tôi, hoặc ứng tuyển vào đội. Cả ba đều bắt đầu bằng một tin nhắn.',
    github: 'GitHub org',
    discord: 'Server Discord',
    email: 'works.nekotech@proton.me',
  },

  footer: {
    builtWith: 'Xây bằng Vue, Vite và three.js',
    sourceLink: 'Mã nguồn trên GitHub',
    rights: 'NekoTech Foundation',
    sections: 'Mục',
    status: 'Vận hành từ Hà Nội',
    timezone: 'ICT',
  },

  sideProjects: {
    back: 'Về trang chủ',
    label: 'Dự án phụ',
    heading: 'Những thứ chúng tôi làm cho chính mình.',
    lede:
      'Không phải sản phẩm, không có roadmap — viết vì chúng tôi muốn có, giữ lại vì người khác cũng dùng.',
    items: {
      nekobuckets: {
        tag: 'Discord bot',
        summary:
          'Discord bot đa dụng của Heiznerd, lo phần quản trị và giải trí mà một cộng đồng thực sự cần, không kèm dashboard bán thêm.',
      },
      nekomusics: {
        tag: 'Discord bot · Mã nguồn mở',
        summary:
          'Bot nhạc mã nguồn mở của Heiznerd. Âm thanh chất lượng cao trong voice channel Discord, không có gói premium chặn hàng chờ.',
      },
    },
    actions: {
      invite: 'Thêm bot',
      viewSource: 'Xem mã nguồn',
    },
  },
};

export default vi;
