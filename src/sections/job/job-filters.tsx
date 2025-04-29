import { useCallback } from 'react';

import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CountrySelect from 'src/components/country-select';

import { IJobFilters, IJobFilterValue } from 'src/types/job';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  //
  filters: IJobFilters;
  onFilters: (name: string, value: IJobFilterValue) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  //
  roleOptions: string[];
  benefitOptions: string[];
  experienceOptions: string[];
  employmentTypeOptions: string[];
  locationOptions: string[];
};

export default function JobFilters({
  open,
  onOpen,
  onClose,
  //
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  roleOptions,
  locationOptions,
  benefitOptions,
  experienceOptions,
  employmentTypeOptions,
}: Props) {
  const handleFilterEmploymentTypes = useCallback(
    (newValue: string) => {
      const checked = filters.employmentTypes.includes(newValue)
        ? filters.employmentTypes.filter((value) => value !== newValue)
        : [...filters.employmentTypes, newValue];
      onFilters('employmentTypes', checked);
    },
    [filters.employmentTypes, onFilters]
  );

  const handleFilterExperience = useCallback(
    (newValue: string) => {
      onFilters('experience', newValue);
    },
    [onFilters]
  );

  const handleFilterRoles = useCallback(
    (newValue: string[]) => {
      onFilters('roles', newValue);
    },
    [onFilters]
  );

  const handleFilterLocations = useCallback(
    (newValue: string[]) => {
      onFilters('locations', newValue);
    },
    [onFilters]
  );

  const handleFilterBenefits = useCallback(
    (newValue: string) => {
      const checked = filters.benefits.includes(newValue)
        ? filters.benefits.filter((value) => value !== newValue)
        : [...filters.benefits, newValue];
      onFilters('benefits', checked);
    },
    [filters.benefits, onFilters]
  );

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={onResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderEmploymentTypes = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Employment Types
      </Typography>
      {employmentTypeOptions.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={filters.employmentTypes.includes(option)}
              onClick={() => handleFilterEmploymentTypes(option)}
            />
          }
          label={option}
        />
      ))}
    </Stack>
  );

  const renderExperience = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Experience
      </Typography>
      {experienceOptions.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Radio
              checked={option === filters.experience}
              onClick={() => handleFilterExperience(option)}
            />
          }
          label={option}
          sx={{
            ...(option === 'all' && {
              textTransform: 'capitalize',
            }),
          }}
        />
      ))}
    </Stack>
  );

  const renderRoles = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Roles
      </Typography>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={roleOptions.map((option) => option)}
        getOptionLabel={(option) => option}
        value={filters.roles}
        onChange={(event, newValue) => handleFilterRoles(newValue)}
        renderInput={(params) => <TextField placeholder="Select Roles" {...params} />}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={option}
              size="small"
              variant="soft"
            />
          ))
        }
      />
    </Stack>
  );

  const renderLocations = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Locations
      </Typography>

      <CountrySelect
        placeholder={filters.locations.length ? '+ Locations' : 'Select Locations'}
        fullWidth
        multiple
        value={filters.locations}
        onChange={(event, newValue) => handleFilterLocations(newValue)}
        options={locationOptions}
        getOptionLabel={(option) => option}
      />
    </Stack>
  );

  const renderBenefits = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Benefits
      </Typography>
      {benefitOptions.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={filters.benefits.includes(option)}
              onClick={() => handleFilterBenefits(option)}
            />
          }
          label={option}
        />
      ))}
    </Stack>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderEmploymentTypes}

            {renderExperience}

            {renderRoles}

            {renderLocations}

            {renderBenefits}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
