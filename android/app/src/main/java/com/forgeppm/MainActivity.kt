package com.forgeppm

import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "ForgePPM"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flag [fabricEnabled].
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Call the method to get the build number when the activity is created
        getBuildNumber()
    }

    private fun getBuildNumber() {
        try {
            // Fetch package info
            val packageInfo: PackageInfo = packageManager.getPackageInfo(packageName, 0)
            val buildNumber = packageInfo.versionCode.toString() // versionCode is the build number
            Log.d("Build Number", buildNumber) // Log it for debugging
        } catch (e: PackageManager.NameNotFoundException) {
            e.printStackTrace()
        }
    }
}
