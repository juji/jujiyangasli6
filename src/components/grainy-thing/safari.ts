// Check for Safari-specific features
export const hasSafariWebkit = () => {
  const div = document.createElement("div");
  return (
    "webkitAudioContext" in window &&
    "webkitRequestAnimationFrame" in window &&
    // Check for Safari-specific CSS properties
    "webkitLineClamp" in div.style
  );
};

export function isSafariOrWebkit() {
  // Get the user agent
  const ua = navigator.userAgent.toLowerCase();

  // Check if running on iOS (all browsers on iOS use WebKit)
  // @ts-expect-error
  const isIOS = /ipad|iphone|ipod/.test(ua) && !window.MSStream;

  // Check if it's Safari specifically
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  return {
    isSafari: isSafari, // True for desktop Safari
    isIOS: isIOS, // True for iOS devices
    isIOSSafari: isIOS && isSafari, // True for Safari on iOS
    usesSafariWebKit: hasSafariWebkit(), // True for Safari/WebKit-based browsers

    // Helper method to get more specific info
    // getBrowserInfo() {
    //     if (this.isIOSSafari) return 'iOS Safari';
    //     if (this.isSafari) return 'Desktop Safari';
    //     if (this.isIOS) return 'iOS WebKit Browser';
    //     if (this.usesSafariWebKit) return 'WebKit-based Browser';
    //     return 'Not Safari or WebKit-based';
    // }
  };
}
