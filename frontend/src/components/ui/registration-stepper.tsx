import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the type for a single step
export interface StepProps {
  step: number;
  title: string;
  description: string;
  content: React.ReactNode;
}

// Define the props for the main component
interface RegistrationStepperProps {
  className?: string;
  steps: StepProps[];
  currentStep: number;
  headerTitle: string;
  headerStatus: string;
}

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 20 } },
};

const contentVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
};

export const RegistrationStepper = ({
  className,
  steps,
  currentStep,
  headerTitle,
  headerStatus,
}: RegistrationStepperProps) => {

  return (
    <div className={cn("w-screen max-w-md mx-auto", className)}>
      <div className="border bg-card text-card-foreground shadow-carbon-sm">
        <div className="flex flex-col space-y-1.5 p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold leading-none tracking-tight text-xl">{headerTitle}</h3>
            <span className="text-xs font-semibold text-[var(--color-carbon-blue-60)] bg-blue-50 px-3 py-1 border border-blue-200 uppercase tracking-wider">
              {headerStatus}
            </span>
          </div>
        </div>

        <div className="p-0">
          <ol className="flex flex-col">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;

              return (
                <li key={step.title} className={cn("overflow-hidden border-b last:border-b-0 transition-colors", isActive ? "bg-white" : "bg-gray-50")}>
                  <div className={cn("flex items-start gap-4 p-6 border-l-4", isActive ? "border-[var(--color-carbon-blue-60)]" : "border-transparent")}>
                    <div className="flex flex-col items-center pt-1">
                      <div className="relative flex h-6 w-6 items-center justify-center">
                        <AnimatePresence>
                          {isCompleted ? (
                            <motion.div
                              key="check"
                              variants={iconVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                            >
                              <CheckCircle2 className="h-6 w-6 text-[var(--color-carbon-blue-60)]" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="circle"
                              initial={{ scale: 1 }}
                              animate={{ scale: isActive ? 1 : 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className={cn(
                                "flex items-center justify-center h-6 w-6 border-2 font-semibold text-xs",
                                isActive ? "border-[var(--color-carbon-blue-60)] bg-[var(--color-carbon-blue-60)] text-white" : "border-gray-400 text-gray-500"
                              )}>
                                {stepNumber}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between cursor-pointer">
                        <div>
                          <h4 className={cn("font-semibold text-[15px]", isActive ? "text-[var(--color-carbon-blue-60)]" : (isCompleted ? "text-gray-900" : "text-gray-500"))}>
                            {step.title}
                          </h4>
                          {isActive && <p className="text-sm text-gray-600 mt-1">{step.description}</p>}
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            key="content"
                            variants={contentVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            className="overflow-hidden"
                          >
                            <div className="pt-6">{step.content}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
};
