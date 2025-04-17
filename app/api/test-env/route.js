export async function GET() {
  try {
    // Get all environment variables (filter out any with 'secret' in the name for security)
    const envVars = Object.keys(process.env)
      .filter(key => !key.toLowerCase().includes('secret'))
      .reduce((acc, key) => {
        // For sensitive keys like API keys, just show if they exist and their length
        if (key.includes('KEY') || key.includes('TOKEN')) {
          const value = process.env[key];
          acc[key] = {
            exists: !!value,
            length: value ? value.length : 0,
            preview: value && value.length > 8 ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : null
          };
        } else {
          // For non-sensitive keys, show the full value
          acc[key] = process.env[key];
        }
        return acc;
      }, {});

    // Return the environment variables
    return Response.json({
      success: true,
      message: "Environment variables retrieved successfully",
      envCount: Object.keys(envVars).length,
      environment: process.env.NODE_ENV || 'unknown',
      variables: envVars,
      hasGohighlevelKey: !!process.env.GOHIGHLEVEL_API_KEY,
      hasFacebookPixelId: !!process.env.FACEBOOK_PIXEL_ID
    });
  } catch (error) {
    console.error('Error retrieving environment variables:', error);
    return Response.json({
      success: false,
      message: "Error retrieving environment variables",
      error: error.message
    }, { status: 500 });
  }
} 