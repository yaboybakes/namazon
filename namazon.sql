CREATE DATABASE bamazon;
USE bamazon;

create table `products` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `product_name` VARCHAR(30),
  `department_name` VARCHAR(30),
  `price` DECIMAL(10,2),
  `quantity` INT(10),
  primary key (`id`)
);

SET SQL_SAFE_UPDATES = 0;

insert into products(product_name,department_name,price,quantity)
VALUES
('shoes','footwear','10.00','50'),
('sandals','footwear','12.00','20'),
('shirts','apparel','9.00','20'),
('shorts','apparel','9.00','20'),
('socks','apparel','4.00','10'),
('tent','camping','100.00','10'),
('sleeping bag','camping','5.00','50'),
('firewood','camping','2.00','50'),
('golf clubs','sports','200.00','10'),
('basketball','sports','10.00','50');
