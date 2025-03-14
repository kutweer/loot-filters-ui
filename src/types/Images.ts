import AbyssalNexusImage from '../images/abyssal_nexus.png'
import BareGroundImage from '../images/bare_ground.png'
import CatacombsOfKourendImage from '../images/catacombs_of_kourend.png'
import ChambersOfXericImage from '../images/chambers_of_xeric.png'
import GodWarsDungeonImage from '../images/god_wars_dungeon.png'
import GrassImage from '../images/grass.png'
import NightmareImage from '../images/nightmare.png'
import SandImage from '../images/sand.png'
import ScarImage from '../images/scar.png'
import TzhaarImage from '../images/tzhaar.png'
import UndercityImage from '../images/undercity.png'
import WildernessImage from '../images/wilderness.png'
import ZanarisImage from '../images/zanaris.png'
import ZulAndraImage from '../images/zul_andra.png'

export const BackgroundImage = {
    Random: 'Random',
    GodWarsDungeon: 'God Wars Dungeon',
    Grass: 'Grass',
    Sand: 'Sand',
    Tzhaar: 'Tzhaar',
    ChambersOfXeric: 'Chambers of Xeric',
    CatacombsOfKourend: 'Catacombs of Kourend',
    AbyssalNexus: 'Abyssal Nexus',
    Wilderness: 'Wilderness',
    Zanaris: 'Zanaris',
    ZulAndra: 'Zul-andra',
    BareGround: 'Bare ground',
    Scar: 'Scar',
    Undercity: 'Undercity',
    Nightmare: 'Nightmare',
} as const
export type BackgroundImage =
    (typeof BackgroundImage)[keyof typeof BackgroundImage]
export const backgroundImages = Object.values<BackgroundImage>(BackgroundImage)

export const imageFromBackgroundImage = (backgroundImage: BackgroundImage) => {
    switch (backgroundImage) {
        case BackgroundImage.Grass:
            return GrassImage
        case BackgroundImage.Sand:
            return SandImage
        case BackgroundImage.Tzhaar:
            return TzhaarImage
        case BackgroundImage.GodWarsDungeon:
            return GodWarsDungeonImage
        case BackgroundImage.ChambersOfXeric:
            return ChambersOfXericImage
        case BackgroundImage.CatacombsOfKourend:
            return CatacombsOfKourendImage
        case BackgroundImage.AbyssalNexus:
            return AbyssalNexusImage
        case BackgroundImage.Wilderness:
            return WildernessImage
        case BackgroundImage.Zanaris:
            return ZanarisImage
        case BackgroundImage.ZulAndra:
            return ZulAndraImage
        case BackgroundImage.BareGround:
            return BareGroundImage
        case BackgroundImage.Scar:
            return ScarImage
        case BackgroundImage.Undercity:
            return UndercityImage
        case BackgroundImage.Nightmare:
            return NightmareImage
    }
}
