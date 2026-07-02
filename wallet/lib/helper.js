export async function finalizeAndNavigate(signUp, router) {
  await signUp.finalize({
    // Redirect the user to the home page after signing up
    navigate: ({ session, decorateUrl }) => {
      if (session?.currentTask) {
        // Handle pending session tasks
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
        console.log(session?.currentTask);
        return;
      }

      const url = decorateUrl("/");
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        router.push(url);
      }
    },
  });
}
