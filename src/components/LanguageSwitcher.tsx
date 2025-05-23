
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = [
    { value: 'en', label: t('settings.languages.en') },
    { value: 'hi', label: t('settings.languages.hi') },
    { value: 'te', label: t('settings.languages.te') },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {languages.find(lang => lang.value === i18n.language)?.label || 'English'}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup value={i18n.language} onValueChange={handleLanguageChange}>
          {languages.map((language) => (
            <DropdownMenuRadioItem key={language.value} value={language.value} className="flex items-center justify-between">
              {language.label}
              {i18n.language === language.value && <Check className="h-4 w-4" />}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
