// components/BreadcrumbNavigation.js
import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const BreadcrumbNavigation = ({ links, current }) => (
	<Breadcrumb className="my-3">
		<BreadcrumbList>
			{links.map((link, index) => (
				<React.Fragment key={index}>
					<BreadcrumbItem>
						<BreadcrumbLink href={link.href} className={link.className || ""}>
							{link.text}
						</BreadcrumbLink>
					</BreadcrumbItem>
					{index < links.length - 1 && <BreadcrumbSeparator />}
				</React.Fragment>
			))}
			<BreadcrumbSeparator />
			<BreadcrumbItem>{current}</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
);

export default BreadcrumbNavigation;
