"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roadmap_controller_1 = require("./roadmap.controller");
const router = (0, express_1.Router)();
// Public / demoable or authenticated
router.get('/presets', roadmap_controller_1.RoadmapController.getPresets);
router.post('/generate', roadmap_controller_1.RoadmapController.generate);
router.post('/:id/toggle-node', roadmap_controller_1.RoadmapController.toggleNode);
router.post('/compare', roadmap_controller_1.RoadmapController.compare);
exports.default = router;
