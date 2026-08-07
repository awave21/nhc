import ProfileController from './ProfileController'
import SecurityController from './SecurityController'
import IntegrationsController from './IntegrationsController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    SecurityController: Object.assign(SecurityController, SecurityController),
    IntegrationsController: Object.assign(IntegrationsController, IntegrationsController),
}

export default Settings