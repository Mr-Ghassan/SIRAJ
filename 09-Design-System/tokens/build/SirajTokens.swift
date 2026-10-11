// SIRAJ Design Tokens v1.0.0 — generated. Do not edit.
import SwiftUI

public enum SirajColor {
    public static let brandPrimary = Color(red: 0.3765, green: 0.1529, blue: 0.2000)
    public static let brandDeep = Color(red: 0.1725, green: 0.0588, blue: 0.0706)
    public static let brandShadow = Color(red: 0.0902, green: 0.0235, blue: 0.0314)
    public static let brandStone = Color(red: 0.6667, green: 0.5686, blue: 0.5020)
    public static let brandSand = Color(red: 0.8392, green: 0.7529, blue: 0.6980)
    public static let brandBlack = Color(red: 0.0078, green: 0.0078, blue: 0.0078)
    public static let silkHighlight = Color(red: 0.7804, green: 0.6039, blue: 0.6118)
    public static let silkMidtone = Color(red: 0.5059, green: 0.2510, blue: 0.2980)
    public static let silkBase = Color(red: 0.3765, green: 0.1529, blue: 0.2000)
    public static let silkDark = Color(red: 0.2706, green: 0.0863, blue: 0.1216)
    public static let silkShadow = Color(red: 0.0902, green: 0.0235, blue: 0.0314)
    public static let neutralWhite = Color(red: 1.0000, green: 1.0000, blue: 1.0000)
    public static let neutralIvory = Color(red: 0.9686, green: 0.9490, blue: 0.9294)
    public static let neutralLinen = Color(red: 0.9373, green: 0.9059, blue: 0.8784)
    public static let neutralSand = Color(red: 0.8392, green: 0.7529, blue: 0.6980)
    public static let neutralStone = Color(red: 0.6667, green: 0.5686, blue: 0.5020)
    public static let neutralWarmGrey = Color(red: 0.5569, green: 0.5137, blue: 0.4902)
    public static let neutralAsh = Color(red: 0.4196, green: 0.3843, blue: 0.3686)
    public static let neutralGraphite = Color(red: 0.2314, green: 0.2039, blue: 0.2118)
    public static let neutralNearBlack = Color(red: 0.0784, green: 0.0549, blue: 0.0627)
    public static let maroon50 = Color(red: 0.9804, green: 0.9529, blue: 0.9529)
    public static let maroon100 = Color(red: 0.9490, green: 0.8902, blue: 0.8941)
    public static let maroon200 = Color(red: 0.8902, green: 0.7725, blue: 0.7843)
    public static let maroon300 = Color(red: 0.8000, green: 0.6118, blue: 0.6353)
    public static let maroon400 = Color(red: 0.6784, green: 0.4196, blue: 0.4588)
    public static let maroon500 = Color(red: 0.5412, green: 0.2627, blue: 0.3176)
    public static let maroon600 = Color(red: 0.4471, green: 0.1843, blue: 0.2392)
    public static let maroon700 = Color(red: 0.3765, green: 0.1529, blue: 0.2000)
    public static let maroon800 = Color(red: 0.2902, green: 0.1137, blue: 0.1529)
    public static let maroon900 = Color(red: 0.1725, green: 0.0588, blue: 0.0706)
    public static let maroon950 = Color(red: 0.0902, green: 0.0235, blue: 0.0314)
    public static let functionalSuccess = Color(red: 0.3059, green: 0.4196, blue: 0.3098)
    public static let functionalWarning = Color(red: 0.6588, green: 0.4549, blue: 0.1686)
    public static let functionalError = Color(red: 0.6588, green: 0.1961, blue: 0.2275)
    public static let functionalInfo = Color(red: 0.2431, green: 0.3451, blue: 0.4078)
    public static let data1 = Color(red: 0.3765, green: 0.1529, blue: 0.2000)
    public static let data2 = Color(red: 0.6667, green: 0.5686, blue: 0.5020)
    public static let data3 = Color(red: 0.2314, green: 0.2039, blue: 0.2118)
    public static let data4 = Color(red: 0.7804, green: 0.6039, blue: 0.6118)
    public static let data5 = Color(red: 0.5569, green: 0.5137, blue: 0.4902)
    public static let data6 = Color(red: 0.1725, green: 0.0588, blue: 0.0706)
}

public enum SirajSpace {
    public static let s0: CGFloat = 0
    public static let s1: CGFloat = 4
    public static let s2: CGFloat = 8
    public static let s3: CGFloat = 12
    public static let s4: CGFloat = 16
    public static let s5: CGFloat = 24
    public static let s6: CGFloat = 32
    public static let s7: CGFloat = 48
    public static let s8: CGFloat = 64
    public static let s9: CGFloat = 96
    public static let s10: CGFloat = 128
    public static let s11: CGFloat = 192
    public static let s12: CGFloat = 256
}

public enum SirajMotion {
    public static let micro: Double = 0.12
    public static let fast: Double = 0.2
    public static let standard: Double = 0.36
    public static let emphasis: Double = 0.64
    public static let cinematic: Double = 1.2
    public static let hero: Double = 2.4
    public static let easeFlow = Animation.timingCurve(0.45, 0.05, 0.15, 1, duration: 0.36)
    public static let easeDrape = Animation.timingCurve(0.16, 1, 0.3, 1, duration: 0.36)
    public static let easeGlide = Animation.timingCurve(0.65, 0, 0.35, 1, duration: 0.36)
    public static let easeFold = Animation.timingCurve(0.7, 0, 0.2, 1, duration: 0.36)
    public static let easeReveal = Animation.timingCurve(0.77, 0, 0.18, 1, duration: 0.36)
    public static let easeRelease = Animation.timingCurve(0.5, 0, 0.75, 0.25, duration: 0.36)
    public static let easeMicro = Animation.timingCurve(0.2, 0, 0, 1, duration: 0.36)
    public static let springDrape = Animation.interpolatingSpring(mass: 1, stiffness: 90, damping: 19)
    public static let springSettle = Animation.interpolatingSpring(mass: 1, stiffness: 140, damping: 28)
    public static let springSilk = Animation.interpolatingSpring(mass: 1, stiffness: 38, damping: 11)
}
