package entity

import (
	"time"

	"gorm.io/gorm"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("SE64.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	database.AutoMigrate(
		&Employee{}, 
		&Gender{}, 
		&PatientType{}, 
		&PatientRight{}, 
		&Patient{},  
		&Bill{}, 
		&Hospital{}, 
		&PatientType{},
	)
	db = database

	//hospital Data
	Rama 	:=  Hospital{
		Name: "Rama",
		Local: "แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 10400",
	}
	db.Model(&Hospital{}).Create(&Rama)
	Krungthap	:=  Hospital{
		Name: "Krungthap",
		Local: "1308, 9 ถ. มิตรภาพ ตำบลในเมือง อำเภอเมืองนครราชสีมา นครราชสีมา 30000",
	}
	db.Model(&Hospital{}).Create(&Krungthap)
	
	Srinakarin 	:=  Hospital{
		Name: "Srinakarin",
		Local: "ตำบลในเมือง อำเภอเมืองขอนแก่น ขอนแก่น 40000",
	}
	db.Model(&Hospital{}).Create(&Srinakarin)
	Sirirath	:=  Hospital{
		Name: "Sirirath",
		Local: " 2 ถนน วังหลัง แขวงศิริราช เขตบางกอกน้อย กรุงเทพมหานคร 10700",
	}
	db.Model(&Hospital{}).Create(&Sirirath)
	

	//Role Data
	doctor := Role{
		Position: "Doctor",
	}
	db.Model(&Role{}).Create(&doctor)
	nurse := Role{
		Position: "Nurse",
	}
	db.Model(&Role{}).Create(&nurse)
	pharmacist := Role{
		Position: "Pharmacist",
	}
	db.Model(&Role{}).Create(&pharmacist)
	cashier := Role{
		Position: "Cashier",
	}
	db.Model(&Role{}).Create(&cashier)

	//PatientType Data
	Pt1 := RightType{
		Typename: "สิทธิ์สุขภาพถ้วนหน้า",
		Discount: 3000,
	}
	db.Model(&RightType{}).Create(&Pt1)
	Pt2 := RightType{
		Typename: "สิทธิประกันสังคม",
		Discount: 1000,
	}
	db.Model(&RightType{}).Create(&Pt2)
	Pt3 := RightType{
		Typename: "สิทธิค่าลดหย่อน",
		Discount: 500,
	}
	db.Model(&RightType{}).Create(&Pt3)
	Pt4 := RightType{
		Typename: "สิทธิประกันนักศึกษา",
		Discount: 300,
	}
	db.Model(&RightType{}).Create(&Pt4)

	Pt5 := RightType{
		Typename: "สิทธิบัตรสวัสดิการ",
		Discount: 50,
	}
	db.Model(&RightType{}).Create(&Pt5)

	//PatientRight Data
	Pr1 := PatientRight{
		RightType:	Pt1,
		Hospital: Rama,
		Note: "ติดตามอาการ",
		CreditLimit: 10000,
	}
	db.Model(&PatientRight{}).Create(&Pr1)

	Pr2 := PatientRight{
		RightType:	Pt2,
		Hospital: Sirirath,
		Note: "ติดตามอาการ",
		CreditLimit: 20000,
	}
	db.Model(&PatientRight{}).Create(&Pr2)

	// Gender Data (ข้อมูลเพศ)
	male := Gender{
		Identity: "ชาย",
	}
	db.Model(&Gender{}).Create(&male)
	female := Gender{
		Identity: "หญิง",
	}
	db.Model(&Gender{}).Create(&female)

	// PatientType Data
	t1 := PatientType{
		Typename: "ปกติ",
	}
	db.Model(&PatientType{}).Create(&t1)
	t2 := PatientType{
		Typename: "อุบัติเหตุ",
	}
	db.Model(&PatientType{}).Create(&t2)
	t3 := PatientType{
		Typename: "คลอดบุตร",
	}
	db.Model(&PatientType{}).Create(&t3)
	t4 := PatientType{
		Typename: "แรกเกิด",
	}
	db.Model(&PatientType{}).Create(&t4)

	// Employee Data
	password, err := bcrypt.GenerateFromPassword([]byte("123456"), 14)
	db.Model(&Employee{}).Create(&Employee{
		Name:     "เอมิ ฟูคาดะ",
		Email:    "ame@email.com",
		Password: string(password),
		Role:     nurse,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "โซระ ชิน่า",
		Email:    "sora@email.com",
		Password: string(password),
		Role:     nurse,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "แพทย์หญิงอิโอกะ คานาโอ๊ะ",
		Email:    "IIOKA@email.com",
		Password: string(password),
		Role:     doctor,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "โอชิคาวา ยูมิ",
		Email:    "OSHIKAWA@email.com",
		Password: string(password),
		Role:     nurse,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "โซชิคาว่า ไมมิ",
		Email:    "YOSHIKAWA@email.com",
		Password: string(password),
		Role:     pharmacist,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "แพทย์หญิงโอซึกิ ฮิบิกิ",
		Email:    "OOTSUKI@email.com",
		Password: string(password),
		Role:     doctor,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "ฮาตาโน๊ะ ยุย",
		Email:    "HATANO@email.com",
		Password: string(password),
		Role:     cashier,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "แพทย์หญิงยูฮาระ ไอ",
		Email:    "UEHARA@email.com",
		Password: string(password),
		Role:     doctor,
	})

	//Patient Data
	P1 := Patient{
		HN:           "HN000001",
		Pid:          "1361001338630",
		FirstName:    "พรีโต",
		LastName:     "กางเกง",
		Birthdate:    time.Date(2000, 1, 1, 0, 0, 0, 0, time.UTC),
		Age:          21,
		DateAdmit:    time.Now(),
		Symptom:      "",
		Gender:       male,
		PatientType:  t1,
		PatientRight: Pr1,
	}
	db.Model(&Patient{}).Create(&P1)

	P2 := Patient{
		HN:           "HN000002",
		Pid:          "1000000000001",
		FirstName:    "ลุงเริง",
		LastName:     "อินคา",
		Birthdate:    time.Date(2022, 5, 11, 0, 0, 0, 0, time.UTC),
		Age:          20,
		DateAdmit:    time.Date(2002, 5, 11, 0, 0, 0, 0, time.UTC),
		Symptom:      "",
		Gender:       female,
		PatientType:  t1,
		PatientRight: Pr1,
	}
	db.Model(&Patient{}).Create(&P2)


}
