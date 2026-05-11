import { SubjectModule } from './types';

export const SUBJECTS: SubjectModule[] = [
  {
    id: 'economics',
    name: 'Economics',
    code: '030',
    description: 'Explore the dynamics of production, consumption, and the transfer of wealth.',
    class11: [
      {
        id: 'stats-intro-ch',
        title: 'Statistics for Economics: Introduction',
        description: 'Scope and importance of statistics in economics.',
        topics: [
          {
            id: 'what-is-stats',
            title: 'What is Statistics?',
            description: 'Definition in plural and singular sense.',
            content: 'In the plural sense, statistics refers to numerical facts systematically collected. In the singular sense, it is the science of collection, organization, analysis and interpretation of numerical data.'
          }
        ]
      },
      {
        id: 'data-collection-ch',
        title: 'Collection of Data',
        description: 'Sources and methods of data collection.',
        topics: [
          {
            id: 'sampling',
            title: 'Census and Sampling Methods',
            description: 'Different ways of gathering data.',
            content: 'A survey which includes every element of the population is known as a Census. A sample is a group or section of the population from which information is to be obtained.'
          }
        ]
      },
      {
        id: 'ind-eco-dev-ch',
        title: 'Indian Economy on the Eve of Independence',
        description: 'Historical context of the Indian economy.',
        topics: [
          {
            id: 'agri-sector',
            title: 'Agricultural Sector',
            description: 'State of agriculture in 1947.',
            content: 'India\'s economy was primarily agrarian. About 85% of population lived in villages. Agriculture suffered from low productivity due to various systems of land settlement like Zamindari.'
          }
        ]
      }
    ],
    class12: [
      {
        id: 'national-income-ch',
        title: 'National Income and Related Aggregates',
        description: 'Measurement of GDP and national income.',
        topics: [
          {
            id: 'circular-flow',
            title: 'Circular Flow of Income',
            description: 'Flow of goods and money between sectors.',
            content: 'The circular flow of income is a model of the economy in which the major exchanges are represented as flows of money, goods and services, etc. between economic agents.'
          }
        ]
      },
      {
        id: 'money-banking-ch',
        title: 'Money and Banking',
        description: 'Evolution of money and central banking functions.',
        topics: [
          {
            id: 'central-bank',
            title: 'Functions of Central Bank',
            description: 'RBI and its role.',
            content: 'The Central Bank (RBI in India) is the apex institution of the monetary system. Key functions: Bank of Issue, Banker to the Government, Bankers\' Bank, Controller of Credit.'
          }
        ]
      },
      {
        id: 'government-budget-ch',
        title: 'Government Budget and the Economy',
        description: 'Objectives and components of budget.',
        topics: [
          {
            id: 'budget-receipts',
            title: 'Revenue and Capital Receipts',
            description: 'Sources of government income.',
            content: 'Revenue receipts are those that do not create any liability nor cause any reduction in assets. Capital receipts either create a liability or reduce an asset.'
          }
        ]
      }
    ],
    externalResources: [
      { title: 'NCERT Stats for Eco (Class 11)', url: 'https://diksha.gov.in/play/collection/do_31310347545794150411449', type: 'diksha', grade: 11 },
      { title: 'Indian Eco Dev (Class 11)', url: 'https://diksha.gov.in/play/collection/do_3131034754599567361960', type: 'diksha', grade: 11 },
      { title: 'Microeconomics (Class 11)', url: 'https://diksha.gov.in/play/collection/do_31310347544974950411499', type: 'diksha', grade: 11 },
      { title: 'Introductory Macroeconomics (Class 12)', url: 'https://diksha.gov.in/play/collection/do_31310347525381324811064', type: 'diksha', grade: 12 },
      { title: 'Indian Economic Development (Class 12)', url: 'https://diksha.gov.in/play/collection/do_31310347525645107211066', type: 'diksha', grade: 12 },
      { title: 'Macroeconomics (Class 12 WebView)', url: 'https://ncert.nic.in/textbook.php?lehe2=0-6', type: 'ncert', grade: 12 },
      { title: 'Microeconomics (Class 12 WebView)', url: 'https://ncert.nic.in/textbook.php?lehe1=0-6', type: 'ncert', grade: 12 },
      { title: 'Statistics for Economics (NCERT PDF)', url: 'https://ncert.nic.in/textbook/pdf/kest1dd.zip', type: 'ncert', grade: 11 },
      { title: 'Macroeconomics (NCERT PDF)', url: 'https://ncert.nic.in/textbook/pdf/lehe2dd.zip', type: 'ncert', grade: 12 },
      { title: 'Microeconomics (NCERT PDF)', url: 'https://ncert.nic.in/textbook/pdf/lehe1dd.zip', type: 'ncert', grade: 12 }
    ]
  },
  {
    id: 'accountancy',
    name: 'Accountancy',
    code: '055',
    description: 'Master the language of business through financial records and analysis.',
    class11: [
      {
        id: 'acc-theory-ch',
        title: 'Introduction to Accounting',
        description: 'Framework and objectives.',
        topics: [
          {
            id: 'acc-obj',
            title: 'Objectives of Accounting',
            description: 'Why do we record transactions?',
            content: '1. Systematic record of transactions.\n2. Ascertainment of profit/loss.\n3. Assessment of financial position.\n4. Providing information to users.'
          }
        ]
      },
      {
        id: 'recording-trans-ch',
        title: 'Recording of Transactions - I',
        description: 'Journal, Ledger, and Trial Balance.',
        topics: [
          {
            id: 'rules-debit-credit',
            title: 'Rules of Debit and Credit',
            description: 'Traditional and Modern approaches.',
            content: 'Traditional: Real, Personal, and Nominal Accounts.\nModern: Assets, Liabilities, Capital, Revenue, and Expenses.'
          }
        ]
      },
      {
        id: 'rectification-ch',
        title: 'Rectification of Errors',
        description: 'Correcting accounting mistakes.',
        topics: [
          {
            id: 'types-of-errors',
            title: 'Types of Accounting Errors',
            description: 'Omission, Commission, and Principles.',
            content: 'Errors can be clerical or of principle. Clerical errors include errors of omission, commission, and compensating errors. Errors of principle occur when accounting principles are violated.'
          }
        ]
      }
    ],
    class12: [
      {
        id: 'partnership-bas-ch',
        title: 'Accounting for Partnership',
        description: 'Basic concepts and fundamentals.',
        topics: [
          {
            id: 'partnership-features',
            title: 'Essential Features of Partnership',
            description: 'Legal requirements.',
            content: '1. Two or more persons.\n2. Agreement (oral or written).\n3. Business should be lawful.\n4. Profit-sharing is essential.\n5. Mutual agency.'
          }
        ]
      },
      {
        id: 'shares-ch',
        title: 'Accounting for Share Capital',
        description: 'Issue, forfeiture and reissue.',
        topics: [
          {
            id: 'issue-of-shares',
            title: 'Issue of Shares at Premium',
            description: 'Accounting for Securities Premium.',
            content: 'When shares are issued at a price higher than their face value, the excess amount is called Securities Premium. It is credited to the Securities Premium Account.'
          }
        ]
      }
    ],
    externalResources: [
      { title: 'Financial Accounting - I (Class 11)', url: 'https://diksha.gov.in/play/collection/do_3131034754516910081992', type: 'diksha', grade: 11 },
      { title: 'Financial Accounting - II (Class 11)', url: 'https://diksha.gov.in/play/collection/do_31310347545362022411451', type: 'diksha', grade: 11 },
      { title: 'Partnership Accounts (Class 12)', url: 'https://diksha.gov.in/play/collection/do_31310347526558515211068', type: 'diksha', grade: 12 },
      { title: 'Company Accounts & Analysis (Class 12)', url: 'https://diksha.gov.in/play/collection/do_31310347526832128011481', type: 'diksha', grade: 12 },
      { title: 'Accountancy - I (Class 12 WebView)', url: 'https://ncert.nic.in/textbook.php?leac1=0-12', type: 'ncert', grade: 12 },
      { title: 'Accountancy - II (Class 12 WebView)', url: 'https://ncert.nic.in/textbook.php?leac2=0-14', type: 'ncert', grade: 12 },
      { title: 'Accountancy - I (NCERT PDF)', url: 'https://ncert.nic.in/textbook/pdf/leac1dd.zip', type: 'ncert', grade: 12 },
      { title: 'Accountancy - II (NCERT PDF)', url: 'https://ncert.nic.in/textbook/pdf/leac2dd.zip', type: 'ncert', grade: 12 }
    ]
  },
  {
    id: 'business-studies',
    name: 'Business Studies',
    code: '054',
    description: 'Learn the principles of management, finance, and marketing.',
    class11: [
      {
        id: 'bst-nature-ch',
        title: 'Business, Trade and Commerce',
        description: 'Evolution and fundamentals.',
        topics: [
          {
            id: 'eco-activities',
            title: 'Classification of Economic Activities',
            description: 'Business, Profession, and Employment.',
            content: 'Human activities are divided into economic and non-economic. Economic activities are further divided into Business, Profession and Employment.'
          },
          {
            id: 'business-risk',
            title: 'Nature of Business Risk',
            description: 'Types and causes of risk.',
            content: 'Business risk refers to the possibility of inadequate profits or even losses due to uncertainties or unexpected events. Risk is an essential part of every business.'
          }
        ]
      }
    ],
    class12: [
      {
        id: 'mgmt-principles-ch',
        title: 'Principles of Management',
        description: 'Concepts and significance.',
        topics: [
          {
            id: 'fayol-principles',
            title: 'Fayols Principles of Management',
            description: 'The 14 classical principles.',
            content: 'Henri Fayol, known as the father of general management, proposed 14 principles including Division of Work, Authority and Responsibility, Discipline, and Unity of Command.'
          }
        ]
      },
      {
        id: 'marketing-ch',
        title: 'Marketing Management',
        description: 'Marketing mix and philosophies.',
        topics: [
          {
            id: 'marketing-mix',
            title: 'The Marketing Mix (4Ps)',
            description: 'Product, Price, Place, Promotion.',
            content: 'The marketing mix is the set of tactical marketing tools that the firm blends to produce the response it wants in the target market.'
          }
        ]
      }
    ],
    externalResources: [
      { title: 'Business Studies - I (Class 11)', url: 'https://diksha.gov.in/play/collection/do_3131034754331115521988', type: 'diksha', grade: 11 },
      { title: 'Business Studies - II (Class 11)', url: 'https://diksha.gov.in/play/collection/do_31310347543501619211322', type: 'diksha', grade: 11 },
      { title: 'Business Studies - I (Class 12)', url: 'https://diksha.gov.in/play/collection/do_31310347535505817611436', type: 'diksha', grade: 12 },
      { title: 'Business Studies - II (Class 12)', url: 'https://diksha.gov.in/play/collection/do_31310347535887564811438', type: 'diksha', grade: 12 },
      { title: 'Business Studies - I (Class 12 WebView)', url: 'https://ncert.nic.in/textbook.php?lebs1=0-12', type: 'ncert', grade: 12 },
      { title: 'Business Studies - II (Class 12 WebView)', url: 'https://ncert.nic.in/textbook.php?lebs2=0-9', type: 'ncert', grade: 12 },
      { title: 'Business Studies - I (NCERT PDF)', url: 'https://ncert.nic.in/textbook/pdf/lebs1dd.zip', type: 'ncert', grade: 12 },
      { title: 'Business Studies - II (NCERT PDF)', url: 'https://ncert.nic.in/textbook/pdf/lebs2dd.zip', type: 'ncert', grade: 12 }
    ]
  },
  {
    id: 'english-core',
    name: 'English Core',
    code: '301',
    description: 'Literature, writing skills, and comprehension.',
    class11: [
      {
        id: 'hornbill-ch',
        title: 'Hornbill Literature',
        description: 'Prose and poetry collection.',
        topics: [
          {
            id: 'portrait-lady',
            title: 'The Portrait of a Lady',
            description: 'By Khushwant Singh.',
            content: 'A story reflecting the author\'s relationship with his grandmother, her transition from village life to city life, and her deep spiritual connection.'
          }
        ]
      }
    ],
    class12: [
      {
        id: 'flamingo-ch',
        title: 'Flamingo Literature',
        description: 'Main course book for Class 12.',
        topics: [
          {
            id: 'last-lesson',
            title: 'The Last Lesson',
            description: 'Impact of war on education.',
            content: 'Set during the Franco-Prussian war, it highlights the importance of one\'s mother tongue and the pain of being separated from cultural roots.'
          }
        ]
      }
    ],
    externalResources: [
      { title: 'Hornbill (Class 11)', url: 'https://diksha.gov.in/play/collection/do_31310347537265459211316', type: 'diksha', grade: 11 },
      { title: 'Snapshot (Class 11)', url: 'https://diksha.gov.in/play/collection/do_31310347537468620811440', type: 'diksha', grade: 11 },
      { title: 'Flamingo (Class 12)', url: 'https://diksha.gov.in/play/collection/do_31310347535117516811487', type: 'diksha', grade: 12 },
      { title: 'Vistas (Class 12)', url: 'https://diksha.gov.in/play/collection/do_31310347534720204811485', type: 'diksha', grade: 12 },
      { title: 'Flamingo (Class 12 WebView)', url: 'https://ncert.nic.in/textbook.php?lefl1=0-14', type: 'ncert', grade: 12 },
      { title: 'Vistas (Class 12 WebView)', url: 'https://ncert.nic.in/textbook.php?levi1=0-10', type: 'ncert', grade: 12 },
      { title: 'Flamingo (NCERT PDF)', url: 'https://ncert.nic.in/textbook/pdf/lefl1dd.zip', type: 'ncert', grade: 12 },
      { title: 'Vistas (NCERT PDF)', url: 'https://ncert.nic.in/textbook/pdf/levi1dd.zip', type: 'ncert', grade: 12 }
    ]
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    code: '066',
    description: 'Nurturing innovative ideas and managing new business ventures.',
    class11: [
      {
        id: 'ent-concept-ch',
        title: 'Entrepreneurship: Concept and Functions',
        description: 'Understand the foundations of being an entrepreneur.',
        topics: [
          {
            id: 'ent-definition',
            title: 'Definition of Entrepreneurship',
            description: 'Core concepts and characteristics.',
            content: 'Entrepreneurship is the process of setting up ones own business as distinct from pursuing any other economic activity, be it employment or practicing some profession. An entrepreneur is a person who sets up his own business with a view to making profit. Characteristics include: 1. Economic activity, 2. Innovation, 3. Profit potential, 4. Risk bearing.'
          },
          {
            id: 'ent-functions',
            title: 'Functions of an Entrepreneur',
            description: 'The many roles played by business owners.',
            content: 'An entrepreneur performs several functions: 1. Innovation (the basic function), 2. Risk-taking, 3. Organization building, 4. Management of the enterprise, 5. Decision making, 6. Searching for opportunities.'
          }
        ]
      },
      {
        id: 'ent-journey-ch',
        title: 'Entrepreneurial Journey',
        description: 'The path from idea to enterprise.',
        topics: [
          {
            id: 'ent-phases',
            title: 'Phases of Entrepreneurial Journey',
            description: 'Ideation, validation, and scaling.',
            content: 'The journey typically involves: \n1. Self-discovery: Exploring interests and abilities. \n2. Identifying opportunities: Finding gaps in the market. \n3. Generating and evaluating ideas. \n4. Planning: Structuring the business. \n5. Raising resources: Financial and human capital. \n6. Launching: Starting operations. \n7. Growth: Scaling the venture.'
          },
          {
            id: 'ent-motivation',
            title: 'Motivation and Barriers',
            description: 'What drives or stops an entrepreneur.',
            content: 'Motivation includes: Need for achievement, autonomy, and financial gain. Barriers can be: Internal (lack of confidence, fear of failure) or External (lack of capital, complex regulations, lack of infrastructure).'
          }
        ]
      }
    ],
    class12: [
      {
        id: 'ent-opp-ch',
        title: 'Entrepreneurial Opportunity',
        description: 'Sensing and scanning the environment.',
        topics: [
          {
            id: 'opportunity-sensing',
            title: 'Sensing Entrepreneurial Opportunities',
            description: 'Environment scanning techniques.',
            content: 'Enterprise sensing involves: 1. Ability to perceive and preserve relevant information. 2. Ability to see things out of place. 3. Creative thinking. 4. Strategic thinking. Environmental scanning is the process by which organizations monitor their relevant environment to identify opportunities and threats.'
          },
          {
            id: 'product-id',
            title: 'Product Identification',
            description: 'Translating an idea into a product.',
            content: 'The process involves selecting a product or service that has market demand and can be produced profitably. Sources of ideas include: Consumers, existing products, distribution channels, and government policies.'
          }
        ]
      },
      {
        id: 'ent-planning-ch',
        title: 'Entrepreneurial Planning',
        description: 'Business plan components and significance.',
        topics: [
          {
            id: 'business-plan',
            title: 'Components of a Business Plan',
            description: 'Marketing, Operational, and Financial plans.',
            content: 'A business plan acts as a road map. Components: \n1. Executive Summary. \n2. Business Description. \n3. Marketing Plan: Branding, pricing, promotion. \n4. Operational Plan: Location, production process, equipment. \n5. Financial Plan: Budgeting, cash flow projections. \n6. Human Resource Plan: Org structure, job descriptions.'
          }
        ]
      },
      {
        id: 'ent-finance-ch',
        title: 'Business Finance and Arithmetic',
        description: 'The numbers behind the business.',
        topics: [
          {
            id: 'unit-cost',
            title: 'Unit Cost and Unit Price',
            description: 'Basic calculations for profitability.',
            content: 'Unit Cost is the cost of producing one unit of a product. It includes direct materials, direct labor, and overheads. Unit Price is the selling price per unit. Markup is added to the cost to determine the price.'
          },
          {
            id: 'break-even',
            title: 'Break-Even Analysis',
            description: 'Finding the point of no profit, no loss.',
            content: 'Break-even point (BEP) is the level of sales where the total revenue equals the total cost. BEP (in units) = Fixed Costs / (Selling Price per unit - Variable Cost per unit).'
          }
        ]
      },
      {
        id: 'ent-growth-ch',
        title: 'Enterprise Growth Strategies',
        description: 'Managing and growing a mature business.',
        topics: [
          {
            id: 'growth-strat',
            title: 'Internal and External Growth',
            description: 'Organic vs inorganic expansion.',
            content: 'Growth strategies can be: \n1. Internal: Expansion, diversification. \n2. External: Franchising, Mergers, Acquisitions, Joint Ventures.'
          }
        ]
      }
    ],
    externalResources: [
      { title: 'Entrepreneurship (Class 11 NCERT)', url: 'https://ncert.nic.in/textbook.php?keep1=0-7', type: 'ncert', grade: 11 },
      { title: 'Entrepreneurship (Class 12 NCERT)', url: 'https://ncert.nic.in/textbook.php?leep1=0-6', type: 'ncert', grade: 12 },
      { title: 'Entrepreneurship (NCERT PDF)', url: 'https://ncert.nic.in/textbook/pdf/leep1dd.zip', type: 'ncert', grade: 12 }
    ]
  }
];
