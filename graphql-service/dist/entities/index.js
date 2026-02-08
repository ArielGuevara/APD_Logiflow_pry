"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadoFactura = exports.TipoEstado = exports.EstadoVehiculo = exports.EstadoPedido = exports.TipoVehiculo = exports.FleetType = exports.UserStatus = exports.RoleName = void 0;
// ==================== ENUMS ====================
var RoleName;
(function (RoleName) {
    RoleName["CLIENTE"] = "CLIENTE";
    RoleName["REPARTIDOR"] = "REPARTIDOR";
    RoleName["SUPERVISOR"] = "SUPERVISOR";
    RoleName["GERENTE"] = "GERENTE";
    RoleName["ADMIN"] = "ADMIN";
})(RoleName || (exports.RoleName = RoleName = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var FleetType;
(function (FleetType) {
    FleetType["MOTO"] = "MOTO";
    FleetType["CARRO"] = "CARRO";
    FleetType["CAMION"] = "CAMION";
})(FleetType || (exports.FleetType = FleetType = {}));
var TipoVehiculo;
(function (TipoVehiculo) {
    TipoVehiculo["MOTO"] = "MOTO";
    TipoVehiculo["LIVIANO"] = "LIVIANO";
    TipoVehiculo["CAMION"] = "CAMION";
})(TipoVehiculo || (exports.TipoVehiculo = TipoVehiculo = {}));
var EstadoPedido;
(function (EstadoPedido) {
    EstadoPedido["PENDIENTE"] = "PENDIENTE";
    EstadoPedido["EN_PROGRESO"] = "EN_PROGRESO";
    EstadoPedido["ENTREGADO"] = "ENTREGADO";
    EstadoPedido["CANCELADO"] = "CANCELADO";
})(EstadoPedido || (exports.EstadoPedido = EstadoPedido = {}));
var EstadoVehiculo;
(function (EstadoVehiculo) {
    EstadoVehiculo["DISPONIBLE"] = "DISPONIBLE";
    EstadoVehiculo["EN_USO"] = "EN_USO";
    EstadoVehiculo["MANTENIMIENTO"] = "MANTENIMIENTO";
    EstadoVehiculo["INACTIVO"] = "INACTIVO";
})(EstadoVehiculo || (exports.EstadoVehiculo = EstadoVehiculo = {}));
var TipoEstado;
(function (TipoEstado) {
    TipoEstado["DISPONIBLE"] = "DISPONIBLE";
    TipoEstado["OCUPADO"] = "OCUPADO";
    TipoEstado["INACTIVO"] = "INACTIVO";
})(TipoEstado || (exports.TipoEstado = TipoEstado = {}));
var EstadoFactura;
(function (EstadoFactura) {
    EstadoFactura["BORRADOR"] = "BORRADOR";
    EstadoFactura["EMITIDA"] = "EMITIDA";
    EstadoFactura["PAGADA"] = "PAGADA";
    EstadoFactura["ANULADA"] = "ANULADA";
})(EstadoFactura || (exports.EstadoFactura = EstadoFactura = {}));
//# sourceMappingURL=index.js.map