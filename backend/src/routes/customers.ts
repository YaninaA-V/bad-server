import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { Role } from '../models/user'
import { doubleCsrfProtection } from '../middlewares/csrf'

const customerRouter = Router()

customerRouter.get('/', roleGuardMiddleware(Role.Admin), getCustomers)
customerRouter.get('/:id', roleGuardMiddleware(Role.Admin), getCustomerById)
customerRouter.patch('/:id', doubleCsrfProtection, roleGuardMiddleware(Role.Admin), updateCustomer)
customerRouter.delete('/:id', doubleCsrfProtection, roleGuardMiddleware(Role.Admin), deleteCustomer)

export default customerRouter
