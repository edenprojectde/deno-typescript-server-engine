export async function exists(filename: string): Promise<boolean> {
    try {
      await Deno.stat(filename);
      // successful, file or directory must exist
      return true;
    } catch (error) {
        console.log(error)
        return false;
      if (error && error.kind === 2) {
        // file or directory does not exist
      } else {
        // unexpected error, maybe permissions, pass it along
        throw error;
      }
    }
  };