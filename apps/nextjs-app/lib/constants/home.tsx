import { ConnectionCardProps, sidebarFooterItemsProps, sidebarHeaderProps } from "@repo/ts-types/home/v1"
import {  Home, Inbox } from "lucide-react"

export const sidebarItems:sidebarHeaderProps = 
{
    "Application":[
        {title: "Home", url: "/home", icon: Home},
        {title: "Systems", url: "/home/systems", icon: Inbox, isActive:true, items: [
            {title: "System 1", url: "/home/systems/system1"},
            {title: "System 2", url: "/home/systems/system2"},
            {title: "System 3", url: "/home/systems/system3"},
        ]},
    ],
}

export const sidebarFooterItems:sidebarFooterItemsProps[] = 
[
        // {title: "Documentation", url: "#", icon: BookOpen},
        // {title: "Settings", url: "#", icon: Settings2},
        // {title: "Support", url: "https://mail.google.com/mail/u/0/?fs=1&to=support@bsamaritan.com&su=Help&tf=cm", icon: LifeBuoy},
        // {title: "Feedback", url: "#", icon: Send}
]

export const CONNECTIONS: ConnectionCardProps[] = [
    {
      title: 'Notion',
      description: 'Create entries in your notion dashboard and automate tasks.',
      logo: '/connections/notion.png',
      darkLogo: '/connections/notion.png',
      type: 'OAuth2',
      clientId: process.env.NEXT_PUBLIC_NOTION_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_NOTION_CLIENT_SECRET,
      oauthUrl: `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_NOTION_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL}/api/callback/notion&response_type=code&owner=user`,
      published: true,
      showModal: false
    },
    {
      title: 'OpenAI',
      description: 'Interact with openAI API',
      logo: '/connections/openai.png',
      darkLogo: '/connections/openai.png',
      type: 'API Key',
      published: true,
      showModal: true,
      formElements: [
        {
          label: 'API Key',
          placeholder: 'Enter your OpenAI API Key',
          type: 'text',
          name: 'apiKey'
        }
      ]
    },
    {
      title: 'Postgresql',
      description: 'Connect to your Postgresql database',
      logo: '/connections/postgres.png',
      darkLogo: '/connections/postgres.png',
      type: 'Database',
      published: false,
      showModal: true,
      formElements: [
        {
          label: 'Host',
          placeholder: 'Enter your Postgresql Host',
          type: 'text',
          name: 'host'
        },
        {
          label: 'Username',
          placeholder: 'Enter your Postgresql Username',
          type: 'text',
          name: 'username'
        },
        {
          label: 'Password',
          placeholder: 'Enter your Postgresql Password',
          type: 'password',
          name: 'password'
        },
        {
          label: 'Database',
          placeholder: 'Enter your Postgresql Database',
          type: 'text',
          name: 'database'
        },
        {
          label: 'Port',
          placeholder: 'Enter your Postgresql Port',
          type: 'text',
          name: 'port'
        }
      ]   
    },
    {
      title: 'Drive',
      description: 'Connect to your Google Drive',
      logo: '/connections/googleDrive.png',
      darkLogo: '/connections/googleDrive.png',
      type: 'OAuth2',
      published: true,
      showModal: false
    },
    {
      title: 'Youtube',
      description: 'Connect to your Youtube account',
      logo: '/connections/youtube.png',
      darkLogo: '/connections/youtube.png',
      type: 'OAuth2',
      published: true,
        showModal: false
    },
    {
      title: 'Google Calendar',
      description: 'Connect to your Google Calendar account',
      logo: '/connections/calendar.png',
      darkLogo: '/connections/calendar.png',
      type: 'OAuth2',
      published: false,
        showModal: false
    },
    {
      title: 'Google Sheets',
      description: 'Connect to your Google Sheets account',
      logo: '/connections/sheets.png',
      darkLogo: '/connections/sheets.png',
      type: 'OAuth2',
      published: false,
        showModal: false
    },
    {
      title: 'Github',
      description: 'Connect to your Github account',
      logo: '/connections/github.png',
      darkLogo: '/connections/github-dark.png',
      type: 'OAuth2',
      published: false,
        showModal: false
    },
    {
      title: 'Gmail',
      description: 'Connect to your Gmail account',
      logo: '/connections/gmail.png',
      darkLogo: '/connections/gmail.png',
      type: 'OAuth2',
      published: false,
        showModal: false
    },
    {
      title: 'Discord',
      description: 'Connect to your Discord account',
      logo: '/connections/discord.png',
      darkLogo: '/connections/discord.png',
      type: 'OAuth2',
      published: false,
        showModal: false
    },
    {
      title: 'Google Search',
      description: 'Connect to your Google Search account',
      logo: '/connections/googleSearch.png',
      darkLogo: '/connections/googleSearch.png',
      type: 'OAuth2',
      published: false,
        showModal: false
    },
    {
      title: 'Reddit',
      description: 'Connect to your Reddit account',
      logo: '/connections/reddit.png',
      darkLogo: '/connections/reddit.png',
      type: 'OAuth2',
      published: false,
        showModal: false
    },
    {
      title: 'Linkedin',
      description: 'Connect to your Linkedin account',
      logo: '/connections/linkedin.png',
      darkLogo: '/connections/linkedin.png',
      type: 'OAuth2',
      published: false,
        showModal: false
    },
    {
      title: 'Twitter',
      description: 'Connect to your Twitter account',
      logo: '/connections/twitter.png',
      darkLogo: '/connections/twitter-dark.png',
      type: 'OAuth2',
      published: false,
        showModal: false
    }
  ]



