package controller

import (
	"net/http"
	"time"

	//"testing/quick"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/momotaroman112/PatientRight/entity"
)

// Post /patientrights
func CreatePatientrights(c *gin.Context) {

	var patientright entity.PatientRight
	var righttype entity.RightType
	var hospital entity.Hospital
	var employee entity.Employee
	var patient entity.Patient

	// bind เข้าตัวแปร patientright
	if err := c.ShouldBindJSON(&patientright); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : ค้นหา righttype ด้วย id
	if tx := entity.DB().Where("id = ?", patientright.RightTypeID).First(&righttype); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "righttype not found"})
		return
	}

	// : ค้นหา hospital ด้วย id
	if tx := entity.DB().Where("id = ?", patientright.HospitalID).First(&hospital); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Hospital not found"})
		return
	}

	// : ค้นหา Employee ด้วย id
	if tx := entity.DB().Where("id = ?", patientright.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee not found"})
		return
	}

	// : ค้นหา Patient ด้วย id
	if tx := entity.DB().Where("id = ?", patientright.PatientID).First(&patient); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient not found"})
		return
	}

	// : สร้าง patient
	pt := entity.PatientRight{
		RightType:    righttype, // โยงความสัมพันธ์กับ Entity PatientType
		Hospital:     hospital,  // โยงความสัมพันธ์กับ Entity PatientRight
		Employee:     employee,
		DateRocrcord: patientright.DateRocrcord, // ตั่งค่าของ HN ให้เท่ากับค่าที่รับมา
		Note:         patientright.Note,         // ตั่งค่าของ Note ให้เท่ากับค่าที่รับมา
		Patient:      patient,
	}

	// : ขั้นตอนการ validate ข้อมูล
	if _, err := govalidator.ValidateStruct(pt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : บันทึก
	if err := entity.DB().Create(&pt).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": pt})
}

// GET /patientright/:id
func GetPatientRights(c *gin.Context) {
	var patientright entity.PatientRight
	id := c.Param("id")
	if err := entity.DB().Preload("Employee").Preload("Hospital").Preload("Patient").Preload("RightType").Raw("SELECT * FROM patient_rights WHERE id = ?", id).Find(&patientright).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patientright})
}

// GET /patientrights
func ListPatientRights(c *gin.Context) {
	var patientrights []entity.PatientRight
	if err := entity.DB().Raw("SELECT * FROM patient_rights").
		Preload("Patient").
		Preload("Employee").
		Preload("Hospital").
		Preload("RightType").
		Find(&patientrights).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patientrights})
}

// DELETE /patientrights/:id
func DeletePatientRights(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM patient_rights WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patientright not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /patientrights
func UpdatePatientRights(c *gin.Context) {

	type PatientRightUpdate struct {
		DateRocrcord time.Time
		EmployeeID   int
		HospitalID   int
		Note         string
		PatientID    int
		RightTypeID  int
	}
	var id = c.Param("id")
	var updatepatientright PatientRightUpdate
	var righttype entity.RightType
	var hospital entity.Hospital
	var employee entity.Employee

	// bind เข้าตัวแปร patientright
	if err := c.ShouldBindJSON(&updatepatientright); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : ค้นหา righttype ด้วย id
	if tx := entity.DB().Where("id = ?", updatepatientright.RightTypeID).First(&righttype); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "righttype not found"})
		return
	}

	// : ค้นหา hospital ด้วย id
	if tx := entity.DB().Where("id = ?", updatepatientright.HospitalID).First(&hospital); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Hospital not found"})
		return
	}

	// : ค้นหา Employee ด้วย id
	if tx := entity.DB().Where("id = ?", updatepatientright.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee not found"})
		return
	}

	// :   update patient
	uppt := entity.PatientRight{
		RightType:    righttype, // โยงความสัมพันธ์กับ Entity PatientType
		Hospital:     hospital,  // โยงความสัมพันธ์กับ Entity PatientRight
		Employee:     employee,
		DateRocrcord: updatepatientright.DateRocrcord, // ตั่งค่าของ HN ให้เท่ากับค่าที่รับมา
		Note:         updatepatientright.Note,         // ตั่งค่าของ Note ให้เท่ากับค่าที่รับมา
	}

	//ขั้นตอนการ validate ที่นำมาจาก  unit test
	if _, err := govalidator.ValidateStruct(uppt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", id).Updates(&uppt).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// if err := entity.DB().Save(&historysheet).Error; err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }
	c.JSON(http.StatusOK, gin.H{"data": uppt})
}
