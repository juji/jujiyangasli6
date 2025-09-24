WheelEasy

https://wheeleasy.org is an access information web app for people with mobility needs, their
families and friends.

What i did:
- Convert the site from SPA (Created using Create React App) into SEO-Friendly pages using Next.js and Material-UI.
- Integrate Algolia for faster search result in the `explore` page, significantly reducing server load by offloading complex search operations to Algolia's dedicated infrastructure.
- Enhanced site security and performance by migrating DNS toCloudflare, implementing WAF rules to protect against DDoS attacks while improving global content delivery.
- Designed scalable media infrastructure using self-hosted MinIO as an S3-compatible object storage solution, decoupling media handling from the application server to improve performance and reliability while enabling horizontal scaling.
- Engineered client-side image optimization using the WebP format with browser-native compression APIs, reducing bandwidth usage by up to 70%, decreasing storage costs, and improving page load times across the application.
- Implement role-based user auth mechanism and Access Controls for the site.
- Update/Created Admin Sections to manage users, data, and events. Empowering non-technical staff to efficiently manage user accounts, content moderation, and event management without developer intervention.
- Created mechanisms for Volunteers to be tracked based on participation in data collection, by assigning points as rewards for successful contributions.
- Created Hotspot sections as a way to group places based on custom polygonal-area, and the admin interface to manage them.
- Enhanced the user experience by implementing an asynchronous eager-upload system with progress tracking, reducing perceived waiting times by 90%.
