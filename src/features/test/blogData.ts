import {ObjectId, WithId} from "mongodb";
import {IBlog} from "../blog/domain/blog.entity";

export const blogDataTest:WithId<IBlog>[] = [

    {
        _id: new ObjectId(),
        "name": "DavidWalsh",
        "description": "Personal blog of David Walsh sharing tips on JavaScript, Node.js, and web development.",
        "websiteUrl": "https://davidwalsh.name/",
        "createdAt": new Date("2024-12-13T16:15:35.224Z"),
        "isMembership": false
    },
    {     _id: new ObjectId(),
        "name": "DevTips",
        "description": "Weekly tips and tutorials on web development and programming for developers.",
        "websiteUrl": "https://www.youtube.com/user/DevTipsForDesigners",
        "createdAt": new Date("2024-12-12T10:45:35.224Z"),
        "isMembership": false
    },
    {     _id: new ObjectId(),
        "name": "TraversyMedia",
        "description": "YouTube channel and blog offering tutorials on web development, backend, and full-stack programming.",
        "websiteUrl": "https://www.traversymedia.com/",
        "createdAt": new Date("2024-12-11T19:30:35.224Z"),
        "isMembership": false
    },
    {     _id: new ObjectId(),
        "name": "ThePracticalDev",
        "description": "A community blog where developers share stories, tutorials, and programming tips.",
        "websiteUrl": "https://dev.to/",
        "createdAt": new Date("2024-12-10T08:00:35.224Z"),
        "isMembership": false
    },
    {     _id: new ObjectId(),
        "name": "ProgrammingHero",
        "description": "Blog sharing programming tutorials, tips, and learning roadmaps for developers.",
        "websiteUrl": "https://programming-hero.com/",
        "createdAt": new Date("2024-12-09T21:15:35.224Z"),
        "isMembership": false
    },
    {     _id: new ObjectId(),
        "name": "FrontendMasters",
        "description": "A blog offering frontend-focused tutorials and courses by industry experts.",
        "websiteUrl": "https://frontendmasters.com/blog/",
        "createdAt": new Date("2024-12-08T15:45:35.224Z"),
        "isMembership": false
    },
    {     _id: new ObjectId(),
        "name": "TechLead",
        "description": "Insights on software engineering, career tips, and tech culture by a former Google tech lead.",
        "websiteUrl": "https://techlead.dev/",
        "createdAt": new Date("2024-12-07T09:30:35.224Z"),
        "isMembership": false
    },
    {     _id: new ObjectId(),
        "name": "WesBos",
        "description": "JavaScript and web development tutorials, podcasts, and courses by Wes Bos.",
        "websiteUrl": "https://wesbos.com/",
        "createdAt": new Date("2024-12-06T22:00:35.224Z"),
        "isMembership": false
    },
    {     _id: new ObjectId(),
        "name": "SarahDrasner",
        "description": "A blog by Sarah Drasner focusing on animations, Vue.js, and modern frontend development.",
        "websiteUrl": "https://sarah.dev/",
        "createdAt": new Date("2024-12-05T14:15:35.224Z"),
        "isMembership": false
    },
    {     _id: new ObjectId(),
        "name": "NicolásBevacqua",
        "description": "Author of 'JavaScript Application Design,' sharing tips and strategies for modern web apps.",
        "websiteUrl": "https://ponyfoo.com/",
        "createdAt":  new Date("2024-12-04T11:30:35.224Z"),
        "isMembership": false
    },
    {
        _id: new ObjectId(),
        "name": "TaniaRasukin",
        "description": "Personal blog offering web development tutorials, guides, and practical tips.",
        "websiteUrl": "https://www.taniarascia.com/",
        "createdAt": new Date("2024-12-03T16:45:35.224Z"),
        "isMembership": false
    }
]
