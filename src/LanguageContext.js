import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Header
    title: 'KalevaAI',
    subtitle: 'AI-powered social media content adaptation for LinkedIn, Instagram, and Facebook',
    footer: 'KalevaAI - Powered by OpenCV & LLM',
    
    // Text Input Section
    textInputTitle: '📝 Enter Your Text Content',
    textInputPlaceholder: 'Enter your text content here... This could be a blog post, article, announcement, or any text you want to adapt for social media platforms.',
    textInputInfo: 'AI will create platform-specific versions of your text',
    
    // File Upload Section
    uploadTitle: '📁 Upload Media (Optional)',
    uploadDragText: 'Drag & drop files here, or click to select',
    uploadDragActive: 'Drop your files here...',
    uploadSupported: 'Supports images (JPEG, PNG, WebP) and videos (MP4, MOV, AVI)',
    uploadedFiles: 'Uploaded Files',
    
    // Platform Selection
    platformTitle: '🎯 Select Target Platforms',
    linkedin: 'LinkedIn',
    linkedinDesc: 'Professional content',
    linkedinSize: '1200x627px images',
    instagram: 'Instagram',
    instagramDesc: 'Visual storytelling',
    instagramSize: '1080x1080px images',
    facebook: 'Facebook',
    facebookDesc: 'Community engagement',
    facebookSize: '1200x630px images',
    
    // Processing
    processButton: '🚀 Process Content',
    processing: 'Processing...',
    generatingContent: 'Generating',
    
    // Results
    resultsTitle: '✨ Processed Content',
    imagesTitle: 'Images',
    videosTitle: 'Videos',
    textContentTitle: 'Generated Text Content',
    mediaCaptionsTitle: 'Generated Media Captions',
    
    // Platform Results
    linkedinVersion: 'LinkedIn Version',
    instagramVersion: 'Instagram Version',
    facebookVersion: 'Facebook Version',
    
    // Text Versions
    linkedinText1: 'Professional LinkedIn post 1: Transform your original text into a business-focused, professional format with industry insights and relevant hashtags. Perfect for B2B engagement and thought leadership.',
    linkedinText2: 'Professional LinkedIn post 2: Convert your content into a data-driven, analytical format with statistics and professional insights. Ideal for industry discussions and networking.',
    linkedinText3: 'Professional LinkedIn post 3: Create an executive summary style post with key takeaways and actionable insights. Perfect for leadership content and industry expertise.',
    
    instagramText1: 'Engaging Instagram post 1: Convert your text into a visually appealing, story-driven format with emojis, line breaks, and Instagram-specific hashtags. Designed for maximum engagement and visual storytelling.',
    instagramText2: 'Engaging Instagram post 2: Transform your content into a lifestyle-focused post with personal touches, behind-the-scenes elements, and trending hashtags. Perfect for authentic engagement.',
    instagramText3: 'Engaging Instagram post 3: Create an inspirational post with motivational elements, user-generated content prompts, and community-building hashtags. Ideal for brand building.',
    
    facebookText1: 'Conversational Facebook post 1: Adapt your content for Facebook\'s community-focused environment with conversational tone, questions to encourage interaction, and Facebook-optimized hashtags.',
    facebookText2: 'Conversational Facebook post 2: Transform your text into a discussion-starter format with open-ended questions, community polls, and engagement prompts. Perfect for group discussions.',
    facebookText3: 'Conversational Facebook post 3: Create a shareable post with relatable content, personal anecdotes, and community-building elements. Ideal for viral potential.',
    
    // Captions
    linkedinCaption1: 'Professional caption 1 for LinkedIn with relevant hashtags and business focus.',
    linkedinCaption2: 'Professional caption 2 for LinkedIn with industry insights and networking elements.',
    linkedinCaption3: 'Professional caption 3 for LinkedIn with thought leadership and executive presence.',
    
    instagramCaption1: 'Engaging Instagram caption 1 with emojis and visual storytelling elements.',
    instagramCaption2: 'Engaging Instagram caption 2 with lifestyle elements and authentic engagement.',
    instagramCaption3: 'Engaging Instagram caption 3 with inspirational content and community building.',
    
    facebookCaption1: 'Conversational Facebook caption 1 for community engagement and social interaction.',
    facebookCaption2: 'Conversational Facebook caption 2 with discussion prompts and group engagement.',
    facebookCaption3: 'Conversational Facebook caption 3 with shareable content and viral potential.',
    
    // Actions
    copy: 'Copy',
    edit: 'Edit',
    download: 'Download',
    downloadAll: '📦 Download All Content',
    
    // Language Switcher
    language: 'Language',
    english: 'English',
    finnish: 'Suomi',
    
    // New UI Elements
    inputConfiguration: 'Input Configuration',
    contentInput: 'Content Input',
    generatedOutput: 'Generated Output',
    uploadImage: 'Upload Image',
    textContent: 'Text Content',
    socialMediaPlatform: 'Social Media Platform',
    outputType: 'Output Type',
    newspaper: 'Newspaper',
    contentType: 'Content Type',
    layoutOptions: 'Layout Options',
    post: 'Post',
    story: 'Story',
    square: 'Square',
    portrait: 'Portrait',
    landscape: 'Landscape',
    staticOutput: 'Static Output',
    animatedOutput: 'Animated Output',
    generateContent: 'Generate Content',
    textOutput: 'Text Output',
    graphicOutput: 'Graphic Output',
    configureInputs: 'Configure your inputs and click "Generate Content" to see results here',
    noDescription: 'No description generated',
    textLength: 'Text Length',
    short: 'Short',
    medium: 'Medium',
    long: 'Long'
  },
  
  fi: {
    // Header
    title: 'KalevaAI',
    subtitle: 'AI-pohjainen sosiaalisen median sisällön mukauttaminen LinkedInille, Instagramille ja Facebookille',
    footer: 'KalevaAI - Powered by OpenCV & LLM',
    
    // Text Input Section
    textInputTitle: '📝 Syötä Tekstisisältösi',
    textInputPlaceholder: 'Syötä tekstisisältösi tähän... Tämä voi olla blogikirjoitus, artikkeli, ilmoitus tai mikä tahansa teksti, jota haluat mukauttaa sosiaalisen median alustoille.',
    textInputInfo: 'AI luo alustakohtaisia versioita tekstistäsi',
    
    // File Upload Section
    uploadTitle: '📁 Lataa Media (Valinnainen)',
    uploadDragText: 'Vedä ja pudota tiedostot tähän tai klikkaa valitaksesi',
    uploadDragActive: 'Pudota tiedostot tähän...',
    uploadSupported: 'Tukee kuvia (JPEG, PNG, WebP) ja videoita (MP4, MOV, AVI)',
    uploadedFiles: 'Ladatut Tiedostot',
    
    // Platform Selection
    platformTitle: '🎯 Valitse Kohdealustat',
    linkedin: 'LinkedIn',
    linkedinDesc: 'Ammattimainen sisältö',
    linkedinSize: '1200x627px kuvat',
    instagram: 'Instagram',
    instagramDesc: 'Visuaalinen tarinankerronta',
    instagramSize: '1080x1080px kuvat',
    facebook: 'Facebook',
    facebookDesc: 'Yhteisökeskeinen vuorovaikutus',
    facebookSize: '1200x630px kuvat',
    
    // Processing
    processButton: '🚀 Käsittele Sisältö',
    processing: 'Käsitellään...',
    generatingContent: 'Luodaan',
    
    // Results
    resultsTitle: '✨ Käsitelty Sisältö',
    imagesTitle: 'Kuvat',
    videosTitle: 'Videot',
    textContentTitle: 'Luotu Tekstisisältö',
    mediaCaptionsTitle: 'Luodut Median Kuvatekstit',
    
    // Platform Results
    linkedinVersion: 'LinkedIn Versio',
    instagramVersion: 'Instagram Versio',
    facebookVersion: 'Facebook Versio',
    
    // Text Versions
    linkedinText1: 'Ammattimainen LinkedIn julkaisu 1: Muunna alkuperäinen tekstisi liiketoimintakeskeiseen, ammattimaisiin muotoon toimialan näkökulmilla ja asiaankuuluvilla hashtageilla. Täydellinen B2B-vuorovaikutukseen ja ajattelunjohtajuuteen.',
    linkedinText2: 'Ammattimainen LinkedIn julkaisu 2: Muunna sisältösi datapohjaiseksi, analyyttiseksi muotoon tilastoilla ja ammattimaisilla näkökulmilla. Ihanteellinen toimialakeskusteluihin ja verkostoitumiseen.',
    linkedinText3: 'Ammattimainen LinkedIn julkaisu 3: Luo johtajien yhteenveto-tyylinen julkaisu keskeisillä opitseilla ja toimivilla näkökulmilla. Täydellinen johtajuussisältöön ja toimialaosaamiseen.',
    
    instagramText1: 'Mukaansatempaava Instagram julkaisu 1: Muunna tekstisi visuaalisesti miellyttävään, tarinapohjaiseen muotoon emojien, rivinvaihtojen ja Instagram-spesifisten hashtagien kanssa. Suunniteltu maksimaaliseen vuorovaikutukseen ja visuaaliseen tarinankerrontaan.',
    instagramText2: 'Mukaansatempaava Instagram julkaisu 2: Muunna sisältösi elämäntapakeskeiseksi julkaisuksi henkilökohtaisilla kosketuksilla, kulissien takaisilla elementeillä ja trendikkäillä hashtageilla. Täydellinen autenttiseen vuorovaikutukseen.',
    instagramText3: 'Mukaansatempaava Instagram julkaisu 3: Luo inspiroiva julkaisu motivoivilla elementeillä, käyttäjien luoman sisällön kehotuksilla ja yhteisörakentavilla hashtageilla. Ihanteellinen brändinrakentamiseen.',
    
    facebookText1: 'Keskusteluhenkinen Facebook julkaisu 1: Mukauta sisältösi Facebookin yhteisökeskeiseen ympäristöön keskusteluhenkisellä sävyllä, kysymyksillä vuorovaikutuksen rohkaisemiseksi ja Facebook-optimoituilla hashtageilla.',
    facebookText2: 'Keskusteluhenkinen Facebook julkaisu 2: Muunna tekstisi keskustelun aloittajaksi avoimilla kysymyksillä, yhteisöäänestyksillä ja vuorovaikutuksen kehotuksilla. Täydellinen ryhmäkeskusteluihin.',
    facebookText3: 'Keskusteluhenkinen Facebook julkaisu 3: Luo jaettava julkaisu samaistuttavalla sisällöllä, henkilökohtaisilla anekdooteilla ja yhteisörakentavilla elementeillä. Ihanteellinen viralliseen potentiaaliin.',
    
    // Captions
    linkedinCaption1: 'Ammattimainen kuvateksti 1 LinkedInille asiaankuuluvilla hashtageilla ja liiketoimintakeskuksella.',
    linkedinCaption2: 'Ammattimainen kuvateksti 2 LinkedInille toimialan näkökulmilla ja verkostoitumiselementeillä.',
    linkedinCaption3: 'Ammattimainen kuvateksti 3 LinkedInille ajattelunjohtajuudella ja johtajuuspresenssillä.',
    
    instagramCaption1: 'Mukaansatempaava Instagram kuvateksti 1 emojien ja visuaalisen tarinankerronnan elementeillä.',
    instagramCaption2: 'Mukaansatempaava Instagram kuvateksti 2 elämäntapaelementeillä ja autenttisella vuorovaikutuksella.',
    instagramCaption3: 'Mukaansatempaava Instagram kuvateksti 3 inspiroivalla sisällöllä ja yhteisörakentamisella.',
    
    facebookCaption1: 'Keskusteluhenkinen Facebook kuvateksti 1 yhteisökeskeiselle vuorovaikutukselle ja sosiaaliselle kanssakäymiselle.',
    facebookCaption2: 'Keskusteluhenkinen Facebook kuvateksti 2 keskustelun kehotuksilla ja ryhmävuorovaikutuksella.',
    facebookCaption3: 'Keskusteluhenkinen Facebook kuvateksti 3 jaettavalla sisällöllä ja viralliseen potentiaaliin.',
    
    // Actions
    copy: 'Kopioi',
    edit: 'Muokkaa',
    download: 'Lataa',
    downloadAll: '📦 Lataa Kaikki Sisältö',
    
    // Language Switcher
    language: 'Kieli',
    english: 'English',
    finnish: 'Suomi',
    
    // New UI Elements
    inputConfiguration: 'Syöttökonfiguraatio',
    contentInput: 'Sisältösyöttö',
    generatedOutput: 'Luotu Tuotos',
    uploadImage: 'Lataa Kuva',
    textContent: 'Tekstisisältö',
    socialMediaPlatform: 'Sosiaalisen Median Alusta',
    outputType: 'Tulostyyppi',
    newspaper: 'Sanomalehti',
    contentType: 'Sisältötyyppi',
    layoutOptions: 'Asetteluvaihtoehdot',
    post: 'Julkaisu',
    story: 'Tarina',
    square: 'Neliö',
    portrait: 'Pysty',
    landscape: 'Vaaka',
    staticOutput: 'Staattinen Tuotos',
    animatedOutput: 'Animoitu Tuotos',
    generateContent: 'Luo Sisältö',
    textOutput: 'Tekstituotos',
    graphicOutput: 'Graafinen Tuotos',
    configureInputs: 'Määritä syötteesi ja klikkaa "Luo Sisältö" nähdäksesi tulokset täällä',
    noDescription: 'Kuvailua ei luotu',
    textLength: 'Tekstin pituus',
    short: 'Lyhyt',
    medium: 'Keskimääräinen',
    long: 'Pitkä'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };
  
  const switchLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };
  
  return (
    <LanguageContext.Provider value={{ language, t, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

