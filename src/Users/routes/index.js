import { Router } from 'express'
import { providersRouter} from './provider'


const providerManagementRouter = Router()
providerManagementRouter.use("/providers", providersRouter)

export { providerManagementRouter}
