# This is a custom podspec for ffmpeg-kit-ios-full-gpl, which is now retired and no longer available.
# This is a fork of  
# with logic changes to allow both ios and android to retrieve metadata. 

# https://medium.com/@nooruddinlakhani/resolved-ffmpegkit-retirement-issue-in-react-native-a-complete-guide-0f54b113b390

# https://github.com/NooruddinLakhani/ffmpeg-kit-ios-full-gpl/archive/refs/tags/latest.zip

require 'json'

# Load the version from the package.json file
package_json = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))
version = package_json['version']

# Define the podspec for ffmpeg-kit-ios-full-gpl
Pod::Spec.new do |s|
  s.name             = 'ffmpeg-kit-ios-full-gpl'
  s.version          = '6.0'  # Must match what ffmpeg-kit-react-native expects.
  s.summary          = 'Custom full-gpl FFmpegKit iOS frameworks from jharville.'
  s.homepage         = 'https://github.com/jharville/ffmpeg-kit-ios-full-gpl'
  s.license          = { :type => 'LGPL' }
  s.author           = { 'jharville' => 'https://github.com/jharville' }
  s.platform         = :ios, '12.1'
  s.static_framework = true

  s.source = {
    :http => 'https://github.com/jharville/ffmpeg-kit-ios-full-gpl/archive/refs/tags/6.0.zip'
  }

  s.vendored_frameworks = [
    'ffmpeg-kit-ios-full-gpl-6.0/ffmpeg-kit-ios-full-gpl/6.0-80adc/libswscale.xcframework',
    'ffmpeg-kit-ios-full-gpl-6.0/ffmpeg-kit-ios-full-gpl/6.0-80adc/libswresample.xcframework',
    'ffmpeg-kit-ios-full-gpl-6.0/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavutil.xcframework',
    'ffmpeg-kit-ios-full-gpl-6.0/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavformat.xcframework',
    'ffmpeg-kit-ios-full-gpl-6.0/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavfilter.xcframework',
    'ffmpeg-kit-ios-full-gpl-6.0/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavdevice.xcframework',
    'ffmpeg-kit-ios-full-gpl-6.0/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavcodec.xcframework',
    'ffmpeg-kit-ios-full-gpl-6.0/ffmpeg-kit-ios-full-gpl/6.0-80adc/ffmpegkit.xcframework'
  ]
end
