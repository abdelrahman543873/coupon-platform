import { Router } from 'express'
import { providersRouter ,providerFilename} from './provider'
import { bazarsRouter,bazarFilename } from './bazar'

const providerManagementRouter = Router()
providerManagementRouter.use("/providers", providersRouter)
providerManagementRouter.use("/bazars", bazarsRouter)

export { providerManagementRouter}
