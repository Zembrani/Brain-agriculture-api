/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const producer_module_1 = __webpack_require__(4);
const app_controller_1 = __webpack_require__(9);
const app_service_1 = __webpack_require__(10);
const farm_module_1 = __webpack_require__(11);
const crop_module_1 = __webpack_require__(15);
const typeorm_1 = __webpack_require__(19);
const producerEntity_1 = __webpack_require__(20);
const farmEntity_1 = __webpack_require__(22);
const cropEntity_1 = __webpack_require__(23);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        imports: [
            producer_module_1.ProducerModule,
            farm_module_1.FarmModule,
            crop_module_1.CropModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'pguser',
                password: 'secret123',
                database: process.env.POSTGRES_DATABASE || 'agriculture',
                synchronize: true,
                autoLoadEntities: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([producerEntity_1.ProducerEntity, farmEntity_1.FarmEntity, cropEntity_1.CropEntity]),
        ],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProducerModule = void 0;
const common_1 = __webpack_require__(3);
const producer_controller_1 = __webpack_require__(5);
const producer_service_1 = __webpack_require__(8);
let ProducerModule = class ProducerModule {
};
exports.ProducerModule = ProducerModule;
exports.ProducerModule = ProducerModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [producer_controller_1.ProducerController],
        providers: [producer_service_1.ProducerService, { provide: 'IProducerService', useClass: producer_service_1.ProducerService }],
    })
], ProducerModule);


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProducerController = void 0;
const common_1 = __webpack_require__(3);
const producerDomain_1 = __webpack_require__(6);
let ProducerController = class ProducerController {
    producerService;
    constructor(producerService) {
        this.producerService = producerService;
    }
    async getAll() {
        return await this.producerService.getAll();
    }
    async create(body) {
        return await this.producerService.create(body);
    }
    async update(param, body) {
        return await this.producerService.update(param.id, body);
    }
    async delete(param) {
        await this.producerService.delete(param.id);
        return `Producer id: ${param.id} deleted succesfully.`;
    }
};
exports.ProducerController = ProducerController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
], ProducerController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof producerDomain_1.CreateProducerDTO !== "undefined" && producerDomain_1.CreateProducerDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ProducerController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof producerDomain_1.ParamProducerDTO !== "undefined" && producerDomain_1.ParamProducerDTO) === "function" ? _d : Object, typeof (_e = typeof producerDomain_1.UpdateProducerDTO !== "undefined" && producerDomain_1.UpdateProducerDTO) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], ProducerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof producerDomain_1.ParamProducerDTO !== "undefined" && producerDomain_1.ParamProducerDTO) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], ProducerController.prototype, "delete", null);
exports.ProducerController = ProducerController = __decorate([
    (0, common_1.Controller)('producer'),
    __param(0, (0, common_1.Inject)('IProducerService')),
    __metadata("design:paramtypes", [Object])
], ProducerController);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProducerDTO = exports.CreateProducerDTO = exports.ParamProducerDTO = exports.Producer = void 0;
const class_validator_1 = __webpack_require__(7);
class Producer {
    id;
    cpfCnpj;
    name;
    phone;
}
exports.Producer = Producer;
class ParamProducerDTO {
    id;
}
exports.ParamProducerDTO = ParamProducerDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], ParamProducerDTO.prototype, "id", void 0);
class CreateProducerDTO {
    cpfCnpj;
    name;
    phone;
}
exports.CreateProducerDTO = CreateProducerDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreateProducerDTO.prototype, "cpfCnpj", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreateProducerDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreateProducerDTO.prototype, "phone", void 0);
class UpdateProducerDTO {
    cpfCnpj;
    name;
    phone;
}
exports.UpdateProducerDTO = UpdateProducerDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateProducerDTO.prototype, "cpfCnpj", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateProducerDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateProducerDTO.prototype, "phone", void 0);


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProducerService = void 0;
const common_1 = __webpack_require__(3);
let ProducerService = class ProducerService {
    producerRepository;
    constructor(producerRepository) {
        this.producerRepository = producerRepository;
    }
    async getAll() {
        return await this.producerRepository.getAll();
    }
    async create(data) {
        const createdProducer = await this.producerRepository.create(data);
        return createdProducer;
    }
    async update(id, data) {
        const producerExists = await this.producerRepository.getById(id);
        if (!producerExists) {
            throw new common_1.NotFoundException('Producer not found.');
        }
        const producerToUpdate = Object.assign(producerExists, data);
        const updatedProducer = await this.producerRepository.update(producerToUpdate);
        return updatedProducer;
    }
    async delete(id) {
        const producerExists = await this.producerRepository.getById(id);
        if (!producerExists) {
            throw new common_1.NotFoundException('Producer not found.');
        }
        await this.producerRepository.delete(id);
    }
};
exports.ProducerService = ProducerService;
exports.ProducerService = ProducerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IProducerRepository')),
    __metadata("design:paramtypes", [Object])
], ProducerService);


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(3);
const app_service_1 = __webpack_require__(10);
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(3);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FarmModule = void 0;
const common_1 = __webpack_require__(3);
const farm_controller_1 = __webpack_require__(12);
const farm_service_1 = __webpack_require__(14);
let FarmModule = class FarmModule {
};
exports.FarmModule = FarmModule;
exports.FarmModule = FarmModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [farm_controller_1.FarmController],
        providers: [farm_service_1.FarmService, { provide: 'IFarmService', useClass: farm_service_1.FarmService }],
    })
], FarmModule);


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FarmController = void 0;
const common_1 = __webpack_require__(3);
const farmDomain_1 = __webpack_require__(13);
let FarmController = class FarmController {
    farmService;
    constructor(farmService) {
        this.farmService = farmService;
    }
    async getAll() {
        return await this.farmService.getAll();
    }
    async create(body) {
        return await this.farmService.create(body);
    }
    async update(param, body) {
        return await this.farmService.update(param.id, body);
    }
    async delete(param) {
        await this.farmService.delete(param.id);
        return `Farm id: ${param.id} deleted succesfully.`;
    }
};
exports.FarmController = FarmController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
], FarmController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof farmDomain_1.CreateFarmDTO !== "undefined" && farmDomain_1.CreateFarmDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], FarmController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof farmDomain_1.FarmParamDTO !== "undefined" && farmDomain_1.FarmParamDTO) === "function" ? _d : Object, typeof (_e = typeof farmDomain_1.UpdateFarmDTO !== "undefined" && farmDomain_1.UpdateFarmDTO) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], FarmController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof farmDomain_1.FarmParamDTO !== "undefined" && farmDomain_1.FarmParamDTO) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], FarmController.prototype, "delete", null);
exports.FarmController = FarmController = __decorate([
    (0, common_1.Controller)('farm'),
    __param(0, (0, common_1.Inject)('IFarmService')),
    __metadata("design:paramtypes", [Object])
], FarmController);


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateFarmDTO = exports.CreateFarmDTO = exports.FarmParamDTO = exports.Farm = void 0;
const class_validator_1 = __webpack_require__(7);
class Farm {
    id;
    city;
    state;
    totalArea;
    productiveArea;
    nonProductiveArea;
}
exports.Farm = Farm;
class FarmParamDTO {
    id;
}
exports.FarmParamDTO = FarmParamDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], FarmParamDTO.prototype, "id", void 0);
class CreateFarmDTO {
    city;
    state;
    totalArea;
    productiveArea;
    nonProductiveArea;
}
exports.CreateFarmDTO = CreateFarmDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreateFarmDTO.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreateFarmDTO.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreateFarmDTO.prototype, "totalArea", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreateFarmDTO.prototype, "productiveArea", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreateFarmDTO.prototype, "nonProductiveArea", void 0);
class UpdateFarmDTO {
    totalArea;
    productiveArea;
    nonProductiveArea;
}
exports.UpdateFarmDTO = UpdateFarmDTO;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateFarmDTO.prototype, "totalArea", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateFarmDTO.prototype, "productiveArea", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateFarmDTO.prototype, "nonProductiveArea", void 0);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FarmService = void 0;
const common_1 = __webpack_require__(3);
let FarmService = class FarmService {
    farmRepository;
    constructor(farmRepository) {
        this.farmRepository = farmRepository;
    }
    async getAll() {
        return await this.farmRepository.getAll();
    }
    async create(data) {
        return await this.farmRepository.create(data);
    }
    async update(id, data) {
        const farmExists = await this.farmRepository.getById(id);
        if (!farmExists) {
            throw new common_1.NotFoundException('Farm not found.');
        }
        const farmToUpdate = Object.assign(farmExists, data);
        const updatedFarm = await this.farmRepository.update(farmToUpdate);
        return updatedFarm;
    }
    async delete(id) {
        const farmExists = await this.farmRepository.getById(id);
        if (!farmExists) {
            throw new common_1.NotFoundException('Farm not found.');
        }
        await this.farmRepository.delete(id);
    }
};
exports.FarmService = FarmService;
exports.FarmService = FarmService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IFarmRepository')),
    __metadata("design:paramtypes", [Object])
], FarmService);


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CropModule = void 0;
const common_1 = __webpack_require__(3);
const crop_controller_1 = __webpack_require__(16);
const crop_service_1 = __webpack_require__(18);
let CropModule = class CropModule {
};
exports.CropModule = CropModule;
exports.CropModule = CropModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [crop_controller_1.CropController],
        providers: [crop_service_1.CropService, { provide: 'ICropService', useClass: crop_service_1.CropService }],
    })
], CropModule);


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CropController = void 0;
const common_1 = __webpack_require__(3);
const cropDomain_1 = __webpack_require__(17);
let CropController = class CropController {
    cropService;
    constructor(cropService) {
        this.cropService = cropService;
    }
    async getAll() {
        return await this.cropService.getAll();
    }
    async create(body) {
        return await this.cropService.create(body);
    }
};
exports.CropController = CropController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
], CropController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof cropDomain_1.CreateCropDTO !== "undefined" && cropDomain_1.CreateCropDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], CropController.prototype, "create", null);
exports.CropController = CropController = __decorate([
    (0, common_1.Controller)('crop'),
    __param(0, (0, common_1.Inject)('ICropService')),
    __metadata("design:paramtypes", [Object])
], CropController);


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCropDTO = exports.Crop = void 0;
const class_validator_1 = __webpack_require__(7);
class Crop {
    id;
    year;
    crop;
}
exports.Crop = Crop;
class CreateCropDTO {
    year;
    crop;
}
exports.CreateCropDTO = CreateCropDTO;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreateCropDTO.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreateCropDTO.prototype, "crop", void 0);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CropService = void 0;
const common_1 = __webpack_require__(3);
let CropService = class CropService {
    cropRepository;
    constructor(cropRepository) {
        this.cropRepository = cropRepository;
    }
    async getAll() {
        return await this.cropRepository.getAll();
    }
    async create(data) {
        return await this.cropRepository.create(data);
    }
};
exports.CropService = CropService;
exports.CropService = CropService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ICropRepository')),
    __metadata("design:paramtypes", [Object])
], CropService);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProducerEntity = void 0;
const typeorm_1 = __webpack_require__(21);
let ProducerEntity = class ProducerEntity {
    id;
    cpfCnpj;
    name;
    phone;
};
exports.ProducerEntity = ProducerEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('identity'),
    __metadata("design:type", String)
], ProducerEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProducerEntity.prototype, "cpfCnpj", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProducerEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProducerEntity.prototype, "phone", void 0);
exports.ProducerEntity = ProducerEntity = __decorate([
    (0, typeorm_1.Entity)('producer')
], ProducerEntity);


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FarmEntity = void 0;
const typeorm_1 = __webpack_require__(21);
let FarmEntity = class FarmEntity {
    id;
    city;
    state;
    totalArea;
    productiveArea;
    nonProductiveArea;
};
exports.FarmEntity = FarmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('identity'),
    __metadata("design:type", String)
], FarmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FarmEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FarmEntity.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FarmEntity.prototype, "totalArea", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FarmEntity.prototype, "productiveArea", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FarmEntity.prototype, "nonProductiveArea", void 0);
exports.FarmEntity = FarmEntity = __decorate([
    (0, typeorm_1.Entity)('farm')
], FarmEntity);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CropEntity = void 0;
const typeorm_1 = __webpack_require__(21);
let CropEntity = class CropEntity {
    id;
    year;
    crop;
};
exports.CropEntity = CropEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('identity'),
    __metadata("design:type", String)
], CropEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CropEntity.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CropEntity.prototype, "crop", void 0);
exports.CropEntity = CropEntity = __decorate([
    (0, typeorm_1.Entity)('crop')
], CropEntity);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

})();

/******/ })()
;