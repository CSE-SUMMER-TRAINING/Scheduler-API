-- Emoplyees entity 
CREATE TABLE employees (
	employee_id int AUTO_INCREMENT not null,
    employee_name varchar(100) not null, 
    job_title varchar(50) not null, 
    department varchar(100) not null, 
    building varchar(50) not null,
    email varchar(100) not null,
    password varchar(250) not null,
    priority int not null,
	CONSTRAINT employees_pk PRIMARY KEY (employee_id)
);

-- branch 

CREATE TABLE branch(
	branch_id INT AUTO_INCREMENT NOT NULL,
    branch_name varchar(200) NOT NULL,
    place_address varchar(200) NOT NULL,
	CONSTRAINT branch_pk PRIMARY KEY (branch_id)
);

-- BULDING 
CREATE TABLE building(
	building_id INT AUTO_INCREMENT NOT NULL,
	branch_id INT NOT NULL,
    building_name VARCHAR(200) NOT NULL,
	CONSTRAINT building_pk PRIMARY KEY (building_id),
	CONSTRAINT building_branch_fk foreign key (branch_id) references branch(branch_id)
);


-- HALLS

CREATE TABLE halls(
	hall_id INT AUTO_INCREMENT NOT NULL,
    hall_name VARCHAR(200) NOT NULL,
    capacity INT NOT NULL,
    building_id INT NOT NULL,
    floor INT NOT NULL,
    CONSTRAINT halls_pk PRIMARY KEY (hall_id),
    CONSTRAINT hall_building_fk foreign key (building_id) references building(building_id)
);
-- calss entity 
CREATE TABLE classes(
	class_id INT AUTO_INCREMENT NOT NULL,
    no_of_students INT NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    branch_id INT NOT NULL,
    start_bn INT NOT NULL,
    end_bn INT NOT NULL,
    CONSTRAINT classes_pk PRIMARY KEY (class_id),
	CONSTRAINT class_branch_fk foreign key (branch_id) references branch(branch_id)
);

-- 
CREATE TABLE classes_halls(
	hall_id INT NOT NULL,
    class_id INT NOT NULL,
    CONSTRAINT hall_classes_halls_fk foreign key (hall_id) references halls(hall_id),
    CONSTRAINT classes_classes_halls_fk foreign key (class_id) references classes(class_id)
);




-- days 

CREATE TABLE days(
	day_id INT AUTO_INCREMENT,
    day_date DATE NOT NULL,
    needed_hall_observers INT NOT NULL,
    needed_floor_observers INT NOT NULL,
    needed_building_observers INT NOT NULL,
	CONSTRAINT days_pk PRIMARY KEY (day_id)
);


CREATE TABLE days_classes(
	class_id INT NOT NULL,
    day_id INT NOT NULL,
	CONSTRAINT days_days_classes_fk foreign key (day_id) references days(day_id),
    CONSTRAINT classes_days_classes_fk foreign key (class_id) references classes(class_id)
);



CREATE TABLE halls_output(
	hall_id INT AUTO_INCREMENT NOT NULL,
    class_id INT NOT NULL, 
	day_id INT NOT NULL,
    start_bn  INT NOT NULL,
    end_bn INT NOT NULL,
	CONSTRAINT halls_halls_output_fk foreign key (hall_id) references halls(hall_id),
    CONSTRAINT class_halls_output_fk foreign key (class_id) references classes(class_id),
	CONSTRAINT day_halls_output_fk foreign key (day_id) references days(day_id)
);



CREATE TABLE assignments(
	assignment_id INT AUTO_INCREMENT NOT NULL, 
    day_id INT NOT NULL,
    branch_id INT NOT NULL,
    employee_id INT NOT NULL,
    title varchar(200) NOT NULL,
    assignment_time datetime,
    
    CONSTRAINT assignments_pk PRIMARY KEY (assignment_id),
	CONSTRAINT day_assignments_fk foreign key (day_id) references days(day_id),
    CONSTRAINT branch_assignments_fk foreign key (branch_id) references branch(branch_id),
	CONSTRAINT employee_assignments_fk foreign key (employee_id) references employees(employee_id)
);



CREATE TABLE vote(
    vote_id INT AUTO_INCREMENT NOT NULL,
    hall_observers_work_days INT NOT NULL,
    floor_observers_work_days INT NOT NULL,
    building_observers_work_days INT NOT NULL,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration_in_hours INT not null,
    vote_title varchar(200) NOT NULL,
    CONSTRAINT vote_pk PRIMARY KEY (vote_id)
);